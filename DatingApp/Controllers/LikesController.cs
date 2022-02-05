using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Dtos;
using DatingApp.Extentions;
using DatingApp.Helper;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    public class LikesController : BaseController
    {
        private readonly ILikeService _service;
        private readonly IUserService _userService;

        public LikesController(ILikeService service, IUserService userService)
        {
            _userService = userService;
            _service = service;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userService.GetUserByUsernameAsync(username);
            var sourceUser = await _service.GetUserWithLikes(sourceUserId);

            if (likedUser == null) return NotFound();

            if (sourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await _service.GetUserLike(sourceUserId, likedUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _userService.SaveAll()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery] LikeParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await _service.GetUserLikes(likesParams);

            Response.AddPagination(users.CurrentPage,
                users.PageSize, users.TotalCount, users.TotalPage);

            return Ok(users);
        }
    }

}
