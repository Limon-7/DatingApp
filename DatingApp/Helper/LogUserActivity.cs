using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using DatingApp.Models;

namespace DatingApp.Helper
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = resultContext.HttpContext.RequestServices
                .GetService<IUserRepository>();

            var user = await repo.GetUserById(userId);
            user.LastActive= DateTime.Now;
            await repo.SaveAll();
        }
    }
}