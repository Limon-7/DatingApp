using System.Threading.Tasks;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;

namespace DatingApp.Interfaces
{
    public interface ILikeService
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PageList<LikeDto>> GetUserLikes(LikeParams likesParams);
    }
}