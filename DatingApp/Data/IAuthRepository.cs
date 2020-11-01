using System.Threading.Tasks;
using DatingApp.Models;

namespace DatingApp.Data
{
    public interface IAuthRepository : IGenericRepository<User>
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string userName, string password);
        Task<bool> UserExists(string userName);
        Task<User> UserAlreadyExists(string userName);
    }
}