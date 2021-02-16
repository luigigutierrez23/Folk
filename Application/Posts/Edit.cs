using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Posts
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Post Post { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Post.Title).NotEmpty();
                RuleFor(x => x.Post.Description).NotEmpty();
                RuleFor(x => x.Post.Category).NotEmpty();
                RuleFor(x => x.Post.Date).NotEmpty();
                RuleFor(x => x.Post.City).NotEmpty();
                RuleFor(x => x.Post.Venue).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var post = await _context.Posts.FindAsync(request.Post.Id);

                if (post == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Post = "Not found" });
                }

                _mapper.Map(request.Post, post);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}