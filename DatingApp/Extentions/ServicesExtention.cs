using DatingApp.Helper;
using DatingApp.Interfaces;
using DatingApp.Services;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.Extentions
{
    public static class ServicesExtention
    {
        public static void CustomSerices(this IServiceCollection services)
        {

            services.AddTransient<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ILikeService, LikeService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUnitOfWorkService, UnitOfWorkService>();

            services.AddAutoMapper(typeof(Startup));
            // services.AddTransient<Seed>();
            services.AddScoped<LogUserActivity>();
        }
    }
}