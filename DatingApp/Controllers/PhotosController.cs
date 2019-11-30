using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("user/{userId}/photos")]
    public class PhotosController:ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _imapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IUserRepository userRepo,IMapper imapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _userRepo = userRepo;
            _imapper = imapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account account= new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary= new Cloudinary(account);
        }

        [HttpGet("{id}", Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo= await _userRepo.GetPhoto(id);
            var photo= _imapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,[FromForm] PhotoForCreationDto dto)
        {
            if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user= await _userRepo.GetUserById(userId);
            var file= dto.File;
            var uploadResult=new ImageUploadResult();
            if(file.Length>0)
            {
                using(var stream=file.OpenReadStream())
                {
                    var uploadParams= new ImageUploadParams()
                    {
                        File= new FileDescription(file.Name,stream),
                        Transformation= new Transformation().Width(500).Height(500).Crop("fit")
                    };
                    uploadResult= _cloudinary.Upload(uploadParams);
                }
            }
            dto.Url=uploadResult.Uri.ToString();
            dto.PublicId= uploadResult.PublicId;
            var photo=_imapper.Map<Photo>(dto);
            if(!user.Photos.Any(u=>u.IsMain))
                photo.IsMain=true;
            user.Photos.Add(photo);
            if( await _userRepo.SaveAll())
            {
                var photoToreturn= _imapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",new {userId,id=photo.Id},photoToreturn);
            }
            return BadRequest("Photos not found");
        }

        [HttpPut("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user= await _userRepo.GetUserById(userId);
            if(!user.Photos.Any(p=>p.Id==id))
                return Unauthorized();
            var photo= await _userRepo.GetPhoto(id);
            if(photo.IsMain)
                return BadRequest("Your photo already in main photos");
            var currentMainPhoto= await _userRepo.GetMainPhoto(userId);
            currentMainPhoto.IsMain=false;
            photo.IsMain=true;
            if(await _userRepo.SaveAll())
                return NoContent();
            return BadRequest("Could not set photo to main");
            // if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();
            // var user= await _userRepo.GetUserById(userId);
            // if(!user.Photos.Any(p=> p.Id == id))
            //     return Unauthorized();
            // var photo= await _userRepo.GetPhoto(id);
            // if(photo.IsMain)
            // return BadRequest("Your photo already in main photos");
            // var currentMainPhoto= await _userRepo.GetMainPhoto(userId);
            // currentMainPhoto.IsMain= false;
            // photo.IsMain=true;
            // if(await _userRepo.SaveAll())
            //     return NoContent();
            // return BadRequest("Could not set photo to main");
        }
    }
}