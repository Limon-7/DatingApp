using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DatingApp.Data
{
  public class Seed
  {

    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
      if (await userManager.Users.AnyAsync()) return;

      var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
      var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);

      var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };
      foreach (var role in roles)
      {
        await roleManager.CreateAsync(role);
      }
      foreach (var user in users)
      {
        user.UserName = user.UserName.ToLower();
        await userManager.CreateAsync(user, "$Pass0word");

        await userManager.AddToRoleAsync(user, "Member");
      }

      var admin = new AppUser
      {
        UserName = "admin"
      };
      await userManager.CreateAsync(admin, "$Pass0word");

      await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
    }
  }
}