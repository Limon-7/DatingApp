using System.ComponentModel.DataAnnotations;

namespace DatingApp.Dtos
{
    public class UserRegisterDto
    {
        [Required]
        public string UserName{get;set;}
        [Required]
        [MinLength(3)]
        public string Password{get;set;}
    }
}