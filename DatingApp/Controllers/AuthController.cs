using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Dtos;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DatingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAccountService _service;
        private readonly IMapper _imapper;
        private readonly ITokenService _tokenService;

        public AuthController(IAccountService service, IMapper imapper, ITokenService tokenService)
        {
            _imapper = imapper;
            _tokenService = tokenService;
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            var username = dto.UserName.ToLower();

            if (await _service.UserExists(username))
                return BadRequest(new { userNameExists = "Username is already taken" });

            var user = _imapper.Map<AppUser>(dto);
            var createUser = await _service.Register(user, dto.Password);

            return Ok(new UserDto
            {
                Id = createUser.Id,
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _service.Login(dto.UserName.ToLower(), dto.Password);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            });
        }

        [HttpGet("checkUsername")]
        public async Task<IActionResult> checkUserName(string username)
        {
            var user = await _service.UserExists(username);
            if (user)
            {
                return BadRequest(new
                {
                    username
                });
            }
            return Ok(new
            {
                Message = username
            });
        }

        //[AcceptVerbs("Get", "Post")]
        //public async Task<IActionResult> IsEmailAlreadyTake(string email)
        //{
        //    var user = await _authRepository.UserAlreadyExists(email);
        //    if (user == null)
        //    {
        //        return Json(true);
        //    }
        //    else
        //    {
        //        return Json($"{email} is already in use");
        //    }
        //}

    }
}