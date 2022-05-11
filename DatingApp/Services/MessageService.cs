using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helper;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Interfaces
{
  public class MessageService : BaseService<Message>, IMessageService
  {
    private readonly DataContext context;
    private readonly IMapper _mapper;

    public MessageService(DataContext context, IMapper mapper) : base(context)
    {
      this.context = context;
      _mapper = mapper;
    }
    public void AddMessage(Message message)
    {
      _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
      _context.Messages.Remove(message);
    }

    public async Task<Message> GetMessage(int id)
    {
      return await _context.Messages
          .Include(u => u.Sender)
          .Include(u => u.Recipient)
          .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
    {
      var query = _context.Messages
          .OrderByDescending(m => m.MessageSent)
          .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
          .AsQueryable();

      query = messageParams.Container switch
      {
        "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username
            && u.RecipientDeleted == false),
        "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username
            && u.SenderDeleted == false),
        _ => query.Where(u => u.RecipientUsername ==
            messageParams.Username && u.RecipientDeleted == false && u.DateRead == null)
      };

      return await PageList<MessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
    }
    // public async Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
    // {
    //   var query = _context.Messages
    //       .OrderByDescending(m => m.MessageSent)
    //       .AsQueryable();

    //   query = messageParams.Container switch
    //   {
    //     "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.Username
    //         && u.RecipientDeleted == false),
    //     "Outbox" => query.Where(u => u.Sender.UserName == messageParams.Username
    //         && u.SenderDeleted == false),
    //     _ => query.Where(u => u.Recipient.UserName ==
    //         messageParams.Username && u.RecipientDeleted == false && u.DateRead == null)
    //   };

    //   var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

    //   return await PageList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

    // }
    public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername,
string recipientUsername)
    {
      var messages = await _context.Messages
          .Include(u => u.Sender).ThenInclude(p => p.Photos)
          .Include(u => u.Recipient).ThenInclude(p => p.Photos)
          .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted == false
                  && m.Sender.UserName == recipientUsername
                  || m.Recipient.UserName == recipientUsername
                  && m.Sender.UserName == currentUsername && m.SenderDeleted == false
          )
          .OrderBy(m => m.MessageSent)
          .ToListAsync();

      var unreadMessages = messages.Where(m => m.DateRead == null
          && m.Recipient.UserName == currentUsername).ToList();

      if (unreadMessages.Any())
      {
        foreach (var message in unreadMessages)
        {
          message.DateRead = DateTime.Now;
        }

        await _context.SaveChangesAsync();
      }

      return _mapper.Map<IEnumerable<MessageDto>>(messages);
    }

    public async Task<bool> SaveAllAsync()
    {
      return await _context.SaveChangesAsync() > 0;
    }
  }
}