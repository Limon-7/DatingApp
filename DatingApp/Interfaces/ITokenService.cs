using System.Threading.Tasks;
using DatingApp.Models;

namespace DatingApp.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}