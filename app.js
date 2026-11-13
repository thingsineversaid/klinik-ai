// KLINIK AI v1.0 — diagnosis engine berbasis aturan lokal (tanpa API eksternal)
const categoryNames = {
  computer: "Komputer & Laptop", printer: "Printer", internet: "Internet & Jaringan",
  files: "File & Dokumen", software: "Aplikasi & Software", security: "Keamanan Digital"
};
const categoryIcons = {computer:"▣",printer:"▤",internet:"⌁",files:"▧",software:"▦",security:"◇"};
const knowledge = {
  printer: {
    title:"Printer tidak bisa mencetak / berstatus offline",
    cause:"Kemungkinan printer belum terhubung dengan benar, status printer sedang Offline, antrean cetak macet, atau driver mengalami gangguan.",
    steps:["Pastikan printer menyala dan tidak menunjukkan lampu indikator error.","Periksa kabel USB atau pastikan printer dan komputer terhubung ke jaringan Wi-Fi yang sama.","Buka Settings → Bluetooth & devices → Printers & scanners, lalu pilih printer yang digunakan.","Buka antrean cetak (Print queue). Batalkan dokumen yang tertahan jika ada.","Pastikan status Use Printer Offline tidak aktif pada menu Printer.","Coba cetak halaman uji (Print Test Page). Jika tetap gagal, periksa atau instal ulang driver dari situs resmi produsen printer."],
    warning:"Jangan membongkar printer ketika masih terhubung ke listrik. Jika ada kertas tersangkut, ikuti petunjuk produsen."
  },
  computer: {
    title:"Komputer atau laptop berjalan lambat",
    cause:"Penyebab yang umum antara lain terlalu banyak aplikasi berjalan, ruang penyimpanan hampir penuh, pembaruan sistem, atau perangkat mengalami beban kerja tinggi.",
    steps:["Simpan pekerjaan yang sedang dibuka.","Tekan Ctrl + Shift + Esc untuk membuka Task Manager.","Pada tab Processes, periksa aplikasi yang menggunakan CPU, Memory, atau Disk secara tinggi.","Tutup aplikasi yang tidak diperlukan. Jangan menghentikan proses sistem yang tidak dikenal.","Periksa kapasitas penyimpanan pada Settings → System → Storage.","Jalankan pemindaian keamanan menggunakan antivirus tepercaya dan lakukan restart setelah pekerjaan tersimpan."],
    warning:"Jangan menghapus file sistem atau menjalankan aplikasi pembersih yang tidak dikenal."
  },
  internet: {
    title:"Wi-Fi tersambung tetapi tidak ada akses internet",
    cause:"Masalah dapat berasal dari router, modem, gangguan penyedia internet, pengaturan IP/DNS, atau koneksi perangkat.",
    steps:["Periksa apakah perangkat lain juga mengalami masalah yang sama.","Pastikan mode Airplane tidak aktif dan Wi-Fi menyala.","Matikan router/modem melalui tombol daya, tunggu sekitar 30 detik, lalu nyalakan kembali.","Periksa lampu indikator Internet/WAN pada router. Ikuti panduan perangkat jika indikator menunjukkan gangguan.","Jika hanya satu perangkat yang bermasalah, lupakan jaringan Wi-Fi lalu sambungkan kembali menggunakan kata sandi yang benar.","Jika semua perangkat tetap tidak dapat terhubung, hubungi penyedia layanan internet."],
    warning:"Jangan menekan tombol Reset kecil pada router kecuali kamu siap mengatur ulang konfigurasi jaringan."
  },
  files: {
    title:"File atau dokumen tidak bisa dibuka",
    cause:"File mungkin tidak memiliki aplikasi pembuka yang sesuai, ekstensi file berubah, unduhan belum selesai, atau file mengalami kerusakan.",
    steps:["Perhatikan nama dan ekstensi file, misalnya .docx, .pdf, .jpg, atau .xlsx.","Klik kanan file → Open with, lalu pilih aplikasi yang sesuai.","Pastikan file telah selesai diunduh dan ukuran filenya tidak 0 KB.","Coba buka salinan file, bukan file asli. Buat duplikat terlebih dahulu.","Jika file berasal dari email atau internet, pastikan sumbernya tepercaya sebelum membukanya.","Jika tetap gagal, minta pengirim mengirim ulang file atau gunakan fitur perbaikan dari aplikasi yang sesuai."],
    warning:"Jangan mengunggah dokumen pribadi atau rahasia ke situs perbaikan file yang tidak tepercaya."
  },
  software: {
    title:"Aplikasi mengalami error atau tidak merespons",
    cause:"Aplikasi dapat macet karena proses latar belakang, pembaruan yang belum selesai, file aplikasi bermasalah, atau konflik dengan perangkat lunak lain.",
    steps:["Tunggu beberapa saat untuk memastikan aplikasi benar-benar tidak merespons.","Jika aplikasi tetap macet, buka Task Manager dan tutup aplikasi tersebut.","Restart komputer setelah memastikan pekerjaan lain sudah tersimpan.","Periksa apakah tersedia pembaruan aplikasi melalui sumber resmi.","Jika masalah berulang, gunakan Settings → Apps → Installed apps → pilih aplikasi → Advanced options → Repair (jika tersedia).","Jika belum berhasil, pertimbangkan instal ulang dari situs resmi pengembang."],
    warning:"Pastikan data aplikasi sudah dicadangkan sebelum melakukan reset atau instal ulang."
  },
  security: {
    title:"Menerima pesan atau tautan yang mencurigakan",
    cause:"Pesan dapat merupakan upaya phishing yang menyamar sebagai lembaga, layanan, atau orang tepercaya untuk mencuri kata sandi dan informasi pribadi.",
    steps:["Jangan klik tautan atau mengunduh lampiran dari pesan yang mencurigakan.","Periksa alamat email atau nomor pengirim secara teliti.","Waspadai pesan yang mendesak, mengancam, atau menjanjikan hadiah tidak masuk akal.","Jangan pernah memberikan kata sandi, PIN, OTP, atau kode pemulihan kepada siapa pun.","Verifikasi informasi melalui aplikasi atau situs resmi yang kamu ketik sendiri di browser.","Laporkan dan blokir pengirim jika pesan terbukti mencurigakan."],
    warning:"Jika sudah memasukkan kata sandi, segera ubah melalui situs resmi dan aktifkan autentikasi dua faktor."
  }
};

let selectedCategory = "computer";
let toastTimer;
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

function showToast(message){
  const el=$("#toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2500);
}
function navigate(page){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const labels={home:"Beranda",diagnosis:"Diagnosis Masalah",knowledge:"Pusat Pengetahuan",history:"Riwayat Diagnosis"};
  $("#breadcrumbTitle").textContent=labels[page]||"Beranda";
  $("#sidebar").classList.remove("open");
  if(page==="history") renderHistory();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));

function setCategory(category){
  selectedCategory=category;
  $$(".choice").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
  $("#resultPanel").classList.add("hidden");
}
$$(".choice").forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.category)));
$$(".category-card").forEach(b=>b.addEventListener("click",()=>{setCategory(b.dataset.category);navigate("diagnosis")}));
$$("[data-example]").forEach(b=>b.addEventListener("click",()=>{$("#problemInput").value=b.dataset.example}));

function chooseDiagnosisCategory(text){
  const t=text.toLowerCase();
  const rules=[
    ["security",["phishing","penipuan","otp","password","kata sandi","tautan mencurigakan","email palsu","diretas","hack"]],
    ["printer",["printer","mencetak","cetak","tinta","print"]],
    ["internet",["wifi","wi-fi","internet","jaringan","router","koneksi","lan"]],
    ["files",["file","berkas","dokumen","pdf","jpg","foto","gambar","word","excel"]],
    ["software",["aplikasi","software","program","crash","not responding","tidak merespons","error aplikasi"]],
    ["computer",["komputer","laptop","pc","lemot","lambat","hang","menyala","mati","layar"]]
  ];
  for(const [cat,words] of rules){if(words.some(w=>t.includes(w)))return cat;}
  return selectedCategory;
}
function analyze(){
  const input=$("#problemInput").value.trim();
  if(input.length<5){showToast("Ceritakan gejalanya terlebih dahulu.");$("#problemInput").focus();return;}
  const category=chooseDiagnosisCategory(input);
  const data=knowledge[category];
  const result={
    id:Date.now(),category,title:data.title,summary:data.cause,steps:data.steps,
    warning:data.warning,userInput:input,date:new Date().toISOString()
  };
  saveHistory(result); renderResult(result);
}
function renderResult(r){
  const el=$("#resultPanel");
  el.innerHTML=`
    <div class="result-top"><div class="result-check">✓</div><div><h3>Analisis awal selesai</h3><p>Kami menemukan panduan yang paling relevan dengan gejalamu.</p></div><span class="result-tag">PANDUAN UMUM</span></div>
    <div class="result-summary"><b>${escapeHTML(r.title)}</b><p>${escapeHTML(r.summary)}</p></div>
    <b style="font-size:11px">Langkah yang bisa kamu coba</b>
    <ol class="solution-list">${r.steps.map((s,i)=>`<li><span>${i+1}</span><div>${escapeHTML(s)}</div></li>`).join("")}</ol>
    <div class="safety-note"><span>ⓘ</span><p>${escapeHTML(r.warning)}</p></div>
    <div class="result-actions" style="margin-top:15px"><button class="primary-btn" id="solvedBtn">✓ Masalah teratasi</button><button class="outline-btn" id="copyBtn">Salin panduan</button><button class="outline-btn" id="retryBtn">Diagnosis baru</button></div>`;
  el.classList.remove("hidden");
  $("#solvedBtn").addEventListener("click",()=>showToast("Senang mendengarnya! Semoga perangkatmu kembali normal."));
  $("#copyBtn").addEventListener("click",()=>copyText(`${r.title}\n\n${r.summary}\n\n${r.steps.map((s,i)=>`${i+1}. ${s}`).join("\n")}\n\nCatatan: ${r.warning}`));
  $("#retryBtn").addEventListener("click",()=>{$("#problemInput").value="";el.classList.add("hidden");$("#problemInput").focus();});
  el.scrollIntoView({behavior:"smooth",block:"start"});
}
$("#analyzeBtn").addEventListener("click",analyze);
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function getHistory(){try{return JSON.parse(localStorage.getItem("klinikAIHistory")||"[]")}catch{return []}}
function saveHistory(item){const list=getHistory();list.unshift(item);localStorage.setItem("klinikAIHistory",JSON.stringify(list.slice(0,30)));}
function renderHistory(){
  const list=getHistory(),el=$("#historyList");
  if(!list.length){el.innerHTML='<div class="history-empty"><div>◷</div><b>Belum ada riwayat diagnosis</b><span>Hasil diagnosis yang kamu lakukan akan muncul di sini.</span></div>';return;}
  el.innerHTML=list.map(r=>`<div class="history-entry"><div class="history-symbol">${categoryIcons[r.category]||"⌕"}</div><div><b>${escapeHTML(r.title)}</b><small>${escapeHTML(r.userInput)} · ${new Date(r.date).toLocaleString("id-ID")}</small></div><button class="outline-btn" data-history="${r.id}">Lihat</button></div>`).join("");
  $$("[data-history]",el).forEach(b=>b.addEventListener("click",()=>{const r=getHistory().find(x=>x.id===Number(b.dataset.history));if(r){navigate("diagnosis");renderResult(r)}}));
}
$("#clearHistory").addEventListener("click",()=>{if(confirm("Hapus semua riwayat diagnosis di browser ini?")){localStorage.removeItem("klinikAIHistory");renderHistory();showToast("Riwayat berhasil dihapus.");}});

const articles={
  printer:["5 langkah mengatasi printer offline",["Periksa daya dan koneksi printer.","Pastikan printer yang dipilih adalah printer yang benar.","Periksa antrean cetak dan hapus dokumen yang macet.","Pastikan opsi Use Printer Offline tidak aktif.","Perbarui driver melalui situs resmi produsen."]],
  password:["Cara membuat password yang kuat",["Gunakan kata sandi panjang dan unik untuk setiap akun.","Gabungkan beberapa kata yang mudah kamu ingat tetapi sulit ditebak.","Hindari tanggal lahir, nama, atau urutan angka sederhana.","Gunakan password manager tepercaya bila diperlukan.","Aktifkan autentikasi dua faktor (2FA)."]],
  backup:["Pentingnya backup data berkala",["Tentukan data penting yang perlu dicadangkan.","Simpan salinan pada media berbeda, misalnya hard disk eksternal dan penyimpanan cloud tepercaya.","Lakukan backup secara berkala.","Pastikan file cadangan dapat dibuka kembali.","Simpan satu salinan di lokasi terpisah untuk mengurangi risiko kehilangan."]],
  phishing:["Kenali tanda-tanda phishing",["Periksa alamat pengirim dan domain situs dengan teliti.","Waspadai pesan mendesak atau ancaman pemblokiran akun.","Jangan membuka lampiran atau tautan yang tidak diharapkan.","Jangan pernah membagikan OTP, PIN, atau kata sandi.","Verifikasi melalui kanal resmi dan laporkan pesan mencurigakan."]],
  slow:["Membuat komputer bekerja lebih ringan",["Tutup aplikasi yang tidak digunakan.","Periksa aplikasi yang berjalan otomatis saat startup.","Sisakan ruang kosong pada penyimpanan.","Lakukan pembaruan sistem dan pemindaian keamanan.","Pertimbangkan pemeriksaan teknisi jika lambat terus-menerus."]],
  wifi:["Tips dasar mengatasi Wi-Fi",["Periksa apakah perangkat lain dapat terhubung.","Dekatkan perangkat ke router untuk menguji kekuatan sinyal.","Restart router dengan cara yang benar.","Pastikan kata sandi dan jaringan yang dipilih sudah benar.","Hubungi penyedia internet jika semua perangkat kehilangan koneksi."]]
};
$$("[data-article]").forEach(b=>b.addEventListener("click",()=>{
  const [title,steps]=articles[b.dataset.article],el=$("#articleDetail");
  el.innerHTML=`<button class="outline-btn" id="closeArticle">← Tutup panduan</button><h3>${title}</h3><ol>${steps.map(s=>`<li>${escapeHTML(s)}</li>`).join("")}</ol>`;
  el.classList.remove("hidden");el.scrollIntoView({behavior:"smooth",block:"start"});
  $("#closeArticle").addEventListener("click",()=>el.classList.add("hidden"));
}));
$("#knowledgeSearch").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  $$(".knowledge-card").forEach(card=>card.classList.toggle("hidden",!(`${card.dataset.search} ${card.innerText}`.toLowerCase().includes(q))));
});
function copyText(text){
  if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>showToast("Panduan berhasil disalin.")).catch(()=>showToast("Tidak dapat menyalin otomatis."));}
  else showToast("Fitur salin tidak didukung browser ini.");
}
renderHistory();
