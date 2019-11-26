using System.Text;
using AutoMapper;
using DatingApp.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Helper
{
    public static class ServicesExtention
    {
        public static void CustomSerices(this IServiceCollection services){
            services.AddCors();
            services.AddAutoMapper(typeof(Startup));
            //services.AddTransient<Seed>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IValuesRepository, ValuesRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
        }
    }
}