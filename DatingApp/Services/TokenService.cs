using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Interfaces;
using DatingApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Services
{
  public class TokenService : ITokenService
  {
    private readonly IConfiguration _config;
    private readonly UserManager<AppUser> userManager;
    private readonly SymmetricSecurityKey _key;

    public TokenService(IConfiguration config, UserManager<AppUser> userManager)
    {
      _config = config;
      this.userManager = userManager;
      _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
    }
    public async Task<string> CreateToken(AppUser user)
    {
      var claims = new List<Claim>{
                new Claim(JwtRegisteredClaimNames.NameId,user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName,user.UserName)
                /* 
                 new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.UserName)
                 */
            };
      var roles = await userManager.GetRolesAsync(user);
      claims.AddRange(roles.Select(role=> new Claim(ClaimTypes.Role,role)));
      
      var credentiatl = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
      var tokenDiscriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = credentiatl
      };
      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDiscriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}