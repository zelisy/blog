export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-800 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-600">
        Blog Platformuna Hoş Geldiniz!
      </h1>
      <p className="text-lg max-w-2xl leading-relaxed">
        Bu uygulama, kullanıcıların blog yazılarını paylaşabileceği, birbirlerine mesaj gönderebileceği ve
        yöneticilerin içerikleri yönetebileceği bir platformdur.
      </p>

      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <a
          href="/auth/register"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Kayıt Ol
        </a>
        <a
          href="/auth/login"
          className="border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-50 transition"
        >
          Giriş Yap
        </a>
      </div>
    </main>
  );
}
