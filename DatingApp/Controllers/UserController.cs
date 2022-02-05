using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Extentions;
using DatingApp.Helper;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService _service;
        private readonly IMapper _mapper;
        public readonly IPhotoService _photoService;

        public UserController(IUserService service, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _service = service;
            _mapper = mapper;
        }
        //[HttpGet]
        //public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        //{
        //    var userFromRepo = await _service.GetUserById(User.GetUserId());
        //    userParams.UserId = User.GetUserId();
        //    if (string.IsNullOrEmpty(userParams.Gender))
        //    {
        //        userParams.Gender = userFromRepo.Gender == "Male" ? "Female" : "Male";
        //    }
        //    var users = await _service.GetUsers(userParams);
        //    var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
        //    Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPage);
        //    return Ok(usersToReturn);
        //}

        [HttpGet()]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers([FromQuery] UserParams userParams)
        {
            var gender = await _service.GetUserGender(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();

            if (string.IsNullOrEmpty(userParams.Gender))
                userParams.Gender = gender.ToLower() == "male" ? "female" : "male";

            var users = await _service.GetMembersAsync(userParams);

            Response.AddPagination(users.CurrentPage, users.PageSize,
                users.TotalCount, users.TotalPage);

            return Ok(users);
        }

        [HttpGet("Get-memebrs-with-pagin")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembersWithPaginationResponse([FromQuery] UserParams userParams)
        {
            var gender = await _service.GetUserGender(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();

            if (string.IsNullOrEmpty(userParams.Gender))
                userParams.Gender = gender.ToLower() == "male" ? "female" : "male";

            var users = await _service.GetUsersWithPaginationAsync(userParams);

            return Ok(users);
        }


        [HttpGet("{userName}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string userName)
        {
            var user = await _service.GetMemberAsync(userName);
            return Ok(user);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(MemberEditDto dto)
        {
            var user = await _service.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(dto, user);

            _service.Update(user);

            if (await _service.SaveAll())
                return NoContent();

            return BadRequest();
        }

        [HttpPost("AddPhoto")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _service.GetUserById(User.GetUserId());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _service.SaveAll())
            {
                return CreatedAtRoute("GetUser", new { userName = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }


            return BadRequest("Problem addding photo");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var like = await _service.GetLike(id, recipientId);
            if (like != null)
                return BadRequest("You already like this user ");
            if (await _service.GetUserById(recipientId) == null)
                return NotFound();
            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };
            _service.Add<Like>(like);
            if (await _service.SaveAll())
                return Ok();
            return BadRequest("Failed to like user");

        }

    }
}