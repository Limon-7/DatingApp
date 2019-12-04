using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
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

        public AuthController(IAuthRepository authRepository, IConfiguration config, IMapper imapper)
        {
            _imapper = imapper;
            _authRepository = authRepository;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            var username = dto.UserName.ToLower();

            if (await _authRepository.UserExists(username))
                return BadRequest("User Name already exists");

            var userToCreate = _imapper.Map<User>(dto);
            var createUser = await _authRepository.Register(userToCreate, dto.Password);
            var userToReturn= _imapper.Map<UserForDetailsDto>(createUser);
            return CreatedAtRoute("GetUser", new {Controller="User",id=createUser.Id},userToReturn);
        }
        [HttpPost("login")]
        //Reuse Register dto 
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // throw new Exception("Computer says no");
            var userFromRepo = await _authRepository.Login(dto.UserName.ToLower(), dto.Password);
            if (userFromRepo == null)
            {
                return Unauthorized();
            }
            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name,userFromRepo.UserName)
            };
            //var token=new SymmetricSecurityKey ()
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var credentiatl = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDiscriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentiatl
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDiscriptor);
            var userphoto= _imapper.Map<UserForListDto>(userFromRepo);
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                userphoto
            });
        }

        [HttpGet("checkUsername")]
        public async Task<IActionResult> checkUserName(string username)
        {
            //var getuser = username.ToLower();
            var user= await _authRepository.UserExists(username);
            if(user)
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

    }
}