namespace DatingApp.Models
{
    public class Like
    {
        public int LikerId { get; set; }
        public AppUser Liker { get; set; }
        public int LikeeId { get; set; }
        public AppUser Likee { get; set; }
    }
}