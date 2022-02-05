using System.Threading.Tasks;
using DatingApp.Models;

namespace DatingApp.Interfaces
{
    public interface IAccountService : IBaseService<AppUser>
    {
        Task<AppUser> Register(AppUser user, string password);
        Task<AppUser> Login(string userName, string password);
        Task<bool> UserExists(string userName);
        Task<AppUser> UserAlreadyExists(string userName);
    }
}