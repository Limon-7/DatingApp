using System.Linq;
using AutoMapper;
using DatingApp.Dtos;
using DatingApp.Models;

namespace DatingApp.Helper
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>().ForMember(des=>des.PhotoUrl,opt=>{
                opt.MapFrom(src=>src.Photos.FirstOrDefault(p=>p.IsMain).Url);
            }).ForMember(dest=>dest.Age, opt=>{
                opt.MapFrom(d=>d.DateOfBirth.CalCulateAge());
            });
            CreateMap<User, UserForDetailsDto>().ForMember(des=>des.PhotoUrl,opt=>{
                opt.MapFrom(src=>src.Photos.FirstOrDefault(p=>p.IsMain).Url);
            }).ForMember(dest=>dest.Age,opt=>{
                opt.MapFrom(d=>d.DateOfBirth.CalCulateAge());
            });
            CreateMap<Photo , PhotoForDetailedDto>();
            CreateMap<UserForEditDto, User>();
            CreateMap<Photo,PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto,Photo>();
        }
    }
}