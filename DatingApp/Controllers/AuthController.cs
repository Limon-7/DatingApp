using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IMapper _imapper;
        private readonly ITokenService _tokenService;

        public AuthController(IAuthRepository authRepository, IConfiguration config, IMapper imapper, ITokenService tokenService)
        {
            _imapper = imapper;
            _tokenService = tokenService;
            _authRepository = authRepository;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            var username = dto.UserName.ToLower();

            if (await _authRepository.UserExists(username))
                return BadRequest(new { userNameExists = "Username is already taken" });

            var user = _imapper.Map<User>(dto);
            var createUser = await _authRepository.Register(user, dto.Password);

            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            });
        }
        [HttpPost("login")]
        //Reuse Register dto 
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // throw new Exception("Computer says no");
            var user = await _authRepository.Login(dto.UserName.ToLower(), dto.Password);
            if (user == null)
            {
                return Unauthorized();
            }

            var userphoto = _imapper.Map<UserForListDto>(user);
            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            });
        }

        [HttpGet("checkUsername")]
        public async Task<IActionResult> checkUserName(string username)
        {
            //var getuser = username.ToLower();
            var user = await _authRepository.UserExists(username);
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

        [AcceptVerbs("Get", "Post")]
        public async Task<IActionResult> IsEmailAlreadyTake(string email)
        {
            var user = await _authRepository.UserAlreadyExists(email);
            if (user == null)
            {
                return Json(true);
            }
            else
            {
                return Json($"{email} is already in use");
            }
        }

    }
}