using System.Linq;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Interfaces
{
    public class LikeService : BaseService<UserLike>, ILikeService
    {
        public LikeService(DataContext context) : base(context)
        {

        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PageList<LikeDto>> GetUserLikes(LikeParams likeParams)
        {
            var users = _context.AppUsers.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likeParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likeParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            if (likeParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likeParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalCulateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PageList<LikeDto>.CreateAsync(likedUsers,
                likeParams.PageNumber, likeParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.AppUsers
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);

        }
    }
}