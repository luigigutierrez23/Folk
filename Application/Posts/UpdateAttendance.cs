using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var post = await _context.Posts
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if(post == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;

                var hostUsername = post.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = post.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if(attendance != null && hostUsername == user.UserName)
                    post.IsCancelled = !post.IsCancelled;
                
                if(attendance != null && hostUsername != user.UserName)
                    post.Attendees.Remove(attendance);
                
                if(attendance == null)
                {
                    attendance = new PostsAttendee
                    {
                        AppUser = user,
                        Post = post,
                        IsHost = false,
                    };

                    post.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result 
                    ? Result<Unit>.Success(Unit.Value) 
                    : Result<Unit>.Failure("Problem updating attendance"); 
            }
        }
    }
}