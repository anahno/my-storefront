// src/app/page.tsx
import BottomNav from "@/components/BottomNav"; // منوی پایین را وارد می‌کنیم

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-sm p-4">
      <div className="flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <span className="material-icons">apps</span>
          <img
            alt="آواتار کاربر"
            className="w-10 h-10 rounded-full"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRH-ZliZr_u49GbZMyvvkHH02CGOUtSEe0DkrFGCns2pzh-NAtj4Fr3xp-e9k4gUYwdmclRPgAMNCw_PynehO28ieDNtTL_nQP8T7Epqg_d0z8i6iDxqQh9zrjzAUtPosUNX-xNaUd9pBPK0WFQnCcHQZqqoKmlDPmoIkYBytHD1_f9tMrl3Er8pfR8J7SOYayGl_CT2LaDWKi6t3BuCLy0ZAxZS24yv-mzCYDchHNimpT0on03caY8CclpxdZrNS1wpq4pKMv0i7Y"
          />
        </header>

        <div className="relative mb-6">
          <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            className="w-full bg-custom-dark-2 rounded-lg py-3 pr-10 pl-16 border-none focus:ring-0"
            placeholder="جستجو"
            type="text"
          />
          <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-custom-yellow text-black p-2 rounded-lg">
            <span className="material-icons">tune</span>
          </button>
        </div>

        <div className="relative bg-custom-dark-2 rounded-2xl p-6 mb-8 flex items-center h-48 overflow-hidden">
          <div className="z-10">
            <h1 className="text-3xl font-bold mb-2">کالکشن جدید</h1>
            <p className="text-gray-300 mb-4">
              جدیدترین ترندها
              <br />
              در کفش را کشف کنید.
            </p>
            <a
              className="bg-custom-yellow text-black font-bold py-2 px-4 rounded-lg text-sm"
              href="#"
            >
              اکنون خرید کنید
            </a>
          </div>
          <img
            alt="کفش شیک"
            className="absolute left-0 bottom-0 h-40 w-40 object-cover -ml-8 -mb-4 transform rotate-[30deg]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYy5snilEDJcTSFhIF3SIAijJk1Brd84kprZkiMBRGcoLoz2uPiuxRV6_gbIPfPTyKRr3pGmYriDdVzAvsVhja49FoLadU6IBTLspQJuHzRcZB66bqZvdTW6SWcpIDOe9Cet5lPW6RdFOI4Msa2J5GRzBhz2aoxfICcR676Khuo4yEuINwH4FgAuuyTQ0S2P5zkJJsDjSX_25OxsXU_xCc3A32XUJvhoC3qzEqpRCopKqRZjwc2xdFDQDWNcLHQpSBXBVnUoZaE064"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">دسته‌بندی‌ها</h2>
          <a className="text-custom-yellow text-sm" href="#">
            مشاهده همه
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* این بخش دسته‌بندی‌ها بعداً داینامیک می‌شود */}
          <div className="relative rounded-lg overflow-hidden h-40">
            <img
              alt="دسته کفش‌های دویدن"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU_B-dPSBu55U3CWJ78sMuxu2EB7kumaXE7cksaVjojTrcu9-Vs6-91tYr2EYH_QiJ-B7IENLDLYuKv6PmFocXlyGCEsMoffx-euq8MWuBmIFHjCPVgreWYJpDrvmP0NbbYLu0nUOdWVz9QXALNi5ZsaAm5rKHmJvCT8hFc2SbIpcG4IJycFhED5FZog30fLG13XlGbVvGh34diKyYHIJWzBRowTVMr6UbR3jvGm-ka8bQ0zrwxANZsIBuQOHmGR462mZCBqZZz9t_"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-3">
              <span className="text-white font-semibold">دویدن</span>
            </div>
          </div>
          {/* بقیه دسته‌بندی‌ها... */}
        </div>

        <div className="flex-grow"></div>

        <BottomNav activePage="home" />
      </div>
    </div>
  );
}
