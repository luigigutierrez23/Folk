using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Posts
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; } 
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; } 
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var post  = await _context.Posts.FindAsync(request.Id);

                if(post == null) throw new Exception("Could not find post");

                post.Title = request.Title ?? post.Title;
                post.Description = request.Description ?? post.Description;
                post.Category = request.Category ?? post.Category;
                post.Date = request.Date ?? post.Date;
                post.City = request.City ?? post.City;
                post.Venue = request.Venue ?? post.Venue;

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}