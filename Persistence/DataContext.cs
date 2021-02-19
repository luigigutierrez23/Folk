using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostsAttendee> PostsAttendee { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<PostsAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.PostId}));

            builder.Entity<PostsAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Posts)
                .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<PostsAttendee>()
                .HasOne(u => u.Post)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.PostId);
        }
    }
}
