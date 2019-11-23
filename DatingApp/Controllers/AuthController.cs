using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
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

        public AuthController(IAuthRepository authRepository,IConfiguration config)
        {
            _authRepository = authRepository;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
           var username = dto.UserName.ToLower();

            if (await _authRepository.UserExists(username))
            {
                return BadRequest("User Name already exists");
            }
            else
            {
                var userToCreate = new User()
                {
                    UserName = dto.UserName
                };
                var createUser = await _authRepository.Register(userToCreate, dto.Password);
                return StatusCode(201);
            }
        }
        [HttpPost("login")]
        //Reuse Register dto 
        public async Task<IActionResult> Login(LoginDto dto){
            // throw new Exception("Computer says no");
            var user= await _authRepository.Login(dto.UserName.ToLower(),dto.Password);
            if(user==null)
            {
                return Unauthorized();
            }
            var claims=new []{
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.UserName)
            };
            //var token=new SymmetricSecurityKey ()
            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var credentiatl= new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);
            var tokenDiscriptor= new SecurityTokenDescriptor
            {
                Subject= new ClaimsIdentity(claims),
                Expires=DateTime.Now.AddDays(1),
                SigningCredentials=credentiatl
            };
            var tokenHandler= new JwtSecurityTokenHandler();
            var token= tokenHandler.CreateToken(tokenDiscriptor);
            return Ok(new{
                token=tokenHandler.WriteToken(token)
            });
        }






        //[HttpGet] 
        [HttpGet("all")]
        public ActionResult<IEnumerable<string>> GetAll()
        {
            return new string[]
            {
            "limon","tarek","katappa"
            };
        }
    }
}