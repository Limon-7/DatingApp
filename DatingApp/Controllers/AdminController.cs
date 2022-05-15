using System.Linq;
using System.Threading.Tasks;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
  public class AdminController : BaseController
  {
    private readonly UserManager<AppUser> _userManager;
    public AdminController(UserManager<AppUser> userManager)
    {
      _userManager = userManager;
    }
    [Authorize(Policy = "RequiredAdmin")]
    [HttpGet("users-with-role")]
    public async Task<ActionResult> GetUserWithRoles()
    {
      var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                  u.Id,
                  UserName = u.UserName,
                  Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();
      return Ok(users);
    }


    [Authorize(Policy = "RequiredAdmin")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
    {
      var selectedRoles = roles.Split(",").ToArray();

      var user = await _userManager.FindByNameAsync(username);

      if (user == null) return NotFound("Could not find user");

      var userRoles = await _userManager.GetRolesAsync(user);

      var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

      if (!result.Succeeded) return BadRequest("Failed to add to roles");

      result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

      if (!result.Succeeded) return BadRequest("Failed to remove from roles");

      return Ok(await _userManager.GetRolesAsync(user));
    }
    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
      return Ok("Only moderator can access this");
    }
  }
}
