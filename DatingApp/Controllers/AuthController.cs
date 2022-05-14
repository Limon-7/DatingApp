using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Dtos;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly IAccountService _service;
    private readonly UserManager<AppUser> userManager;
    private readonly SignInManager<AppUser> signinManager;
    private readonly IMapper _imapper;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signinManager, IMapper imapper, ITokenService tokenService)
    {
      this.userManager = userManager;
      this.signinManager = signinManager;
      _imapper = imapper;
      _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {

      if (await UserExists(dto.UserName.ToLower()))
        return BadRequest(new { userNameExists = "Username is already taken" });

      var user = _imapper.Map<AppUser>(dto);
      user.UserName = dto.UserName.ToLower();
      var result = await this.userManager.CreateAsync(user, dto.Password);

      if (!result.Succeeded) return BadRequest();

      var roleResult= await this.userManager.AddToRoleAsync(user, "Member");

      if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);


      return Ok(new UserDto
      {
        Id = user.Id,
        UserName = user.UserName,
        Token = await _tokenService.CreateToken(user),
        KnownAs = user.KnownAs,
        Gender = user.Gender
      });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
      var user = await this.userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName.ToLower() == dto.UserName.ToLower()); ;
      if (user == null)
        return Unauthorized("Invalid Username");

      var result = await this.signinManager.CheckPasswordSignInAsync(user, dto.Password, false);

      if (!result.Succeeded) return Unauthorized("Invalid Username or Password");

      return Ok(new UserDto
      {
        Id = user.Id,
        UserName = user.UserName,
        Token =await _tokenService.CreateToken(user),
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

    private async Task<bool> UserExists(string username) => await this.userManager.Users.AnyAsync(x => x.UserName == username.ToLower());

  }
}