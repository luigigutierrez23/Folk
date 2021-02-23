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
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

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
            
            builder.Entity<Comment>()
                .HasOne(a => a.Post)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b => {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });                
        }
    }
}
