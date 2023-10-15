using FalconPay.Web.DB;

namespace FalconPay.Web.Repos
{
    public class SplRepo
    {
        private DevkodContext db;
        public SplRepo()
        {
            db = new DevkodContext();
        }
        public SplToken GetSplToken(string address) {
            return db.SplTokens.Where(x=>x.TokenAddress==address).SingleOrDefault();
        }
        public void add(List<SplToken> tokens) {
            foreach (var item in tokens)
            {
                db.SplTokens.Add(item);
            }
          var cc=  db.SaveChanges();
        }
    }
}
