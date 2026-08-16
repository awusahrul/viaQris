import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, FC } from 'react';
import html2canvas from 'html2canvas';

interface DukunganAktif {
  jumlah: number;
  biaya: number;
  total: number;
  idFaktur: string;
  urlPembayaran: string;
}
interface ItemRiwayat {
  nama: string;
  jumlah: number;
  pesan: string;
  tanggal: string;
}

const HalamanDukungan: NextPage = () => {
  const [nama, aturNama] = useState('');
  const [email, aturEmail] = useState('');
  const [pesan, aturPesan] = useState('');
  const [jumlahDukungan, aturJumlahDukungan] = useState(0);
  const [jumlahKustom, aturJumlahKustom] = useState('');
  const [apakahKustom, aturApakahKustom] = useState(false);
  const [apakahModalQrisTerbuka, aturApakahModalQrisTerbuka] = useState(false);
  const [apakahModalRiwayatTerbuka, aturApakahModalRiwayatTerbuka] = useState(false);
  const [apakahModalPeringatanTerbuka, aturApakahModalPeringatanTerbuka] = useState(false);
  const [sedangMemuat, aturSedangMemuat] = useState(false);
  const [sedangProsesTransaksi, aturSedangProsesTransaksi] = useState(false);
  const [apakahDropdownTerbuka, aturApakahDropdownTerbuka] = useState(false);
  const [setujuUmur, aturSetujuUmur] = useState(false);
  const [setujuSyarat, aturSetujuSyarat] = useState(false);
  const [riwayat, aturRiwayat] = useState<ItemRiwayat[]>([]);
  const [dukunganAktif, aturDukunganAktif] = useState<DukunganAktif | null>(null);
  const [hitungMundur, aturHitungMundur] = useState(300);
  const [timestampBukaModal, aturTimestampBukaModal] = useState<number | null>(null);
  
  const persenBiayaLayanan = 0.007;
  const biayaLayanan = Math.ceil(jumlahDukungan * persenBiayaLayanan);
  const totalBayar = jumlahDukungan + biayaLayanan;
  
  useEffect(() => {
    try {
      const riwayatTersimpan = localStorage.getItem('riwayatDukungan');
      if (riwayatTersimpan) aturRiwayat(JSON.parse(riwayatTersimpan));
    } catch (error) { console.error("Gagal memuat riwayat:", error); }
  }, []);

  useEffect(() => {
    let pewaktu: NodeJS.Timeout;
    if (apakahModalQrisTerbuka && hitungMundur > 0) {
      pewaktu = setInterval(() => { aturHitungMundur((prev) => prev - 1); }, 1000);
    }
    return () => clearInterval(pewaktu);
  }, [apakahModalQrisTerbuka, hitungMundur]);

  const formatMataUang = (jumlah: number): string => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(jumlah);
  
  const tanganiPerubahanJumlah = (jumlah: number | 'custom', teks: string) => {
    const elemenTeksDropdown = document.getElementById('teks-pemantik-jumlah');
    if (elemenTeksDropdown) elemenTeksDropdown.textContent = teks;
    aturApakahDropdownTerbuka(false);
    if (jumlah === 'custom') {
      aturApakahKustom(true);
      aturJumlahDukungan(0);
    } else {
      aturApakahKustom(false);
      aturJumlahKustom('');
      aturJumlahDukungan(jumlah);
    }
  };

  const tanganiInputJumlahKustom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nilai = event.target.value.replace(/\D/g, '');
    aturJumlahKustom(nilai);
    aturJumlahDukungan(Number(nilai));
  };
    
  const tanganiKirimFormulir = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!setujuUmur || !setujuSyarat) {
      alert('Anda harus menyetujui semua persyaratan untuk melanjutkan.');
      return;
    }
    if (jumlahDukungan < 1000) {
      alert('Minimal dukungan adalah Rp 1.000');
      return;
    }
    aturSedangMemuat(true);

    const tanggalSekarang = new Date();
    const dataUntukApi = {
      kunciEntri: `dukungan-${tanggalSekarang.getTime()}`,
      dataBaru: {
        penjual: "Sahrul",
        jenis: "jasa" as const,
        tanggal: tanggalSekarang.toISOString(),
        nama: nama,
        email: email,
        pesan: pesan,
        nama_transaksi: `Dukungan dari ${nama}`,
        harga_transaksi: totalBayar.toString(),
        metode_pembayaran_transaksi: "QRIS",
        status_pembayaran_transaksi: "Belum Bayar",
        kedaluwarsa: new Date(tanggalSekarang.getTime() + 5 * 60 * 1000).toISOString(),
      }
    };

    try {
      const responsApi = await fetch('/api/v2', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataUntukApi) });
      const hasil = await responsApi.json();
      if (!responsApi.ok) { throw new Error(hasil.message || 'Gagal menyimpan data dukungan.'); }
      
      const dukunganBaru: DukunganAktif = { jumlah: jumlahDukungan, biaya: biayaLayanan, total: totalBayar, idFaktur: dataUntukApi.kunciEntri, urlPembayaran: hasil.url_pambayaran };
      aturDukunganAktif(dukunganBaru);
      
      const itemRiwayatBaru: ItemRiwayat = { nama, jumlah: jumlahDukungan, pesan, tanggal: new Date().toISOString() };
      const riwayatDiperbarui = [itemRiwayatBaru, ...riwayat];
      aturRiwayat(riwayatDiperbarui);
      localStorage.setItem('riwayatDukungan', JSON.stringify(riwayatDiperbarui));

      aturHitungMundur(300);
      aturTimestampBukaModal(Date.now());
      aturApakahModalQrisTerbuka(true);
      
      aturNama(''); aturEmail(''); aturPesan(''); aturJumlahDukungan(0);
      aturJumlahKustom(''); aturSetujuUmur(false); aturSetujuSyarat(false); aturApakahKustom(false);
      const elemenTeksDropdown = document.getElementById('teks-pemantik-jumlah');
      if (elemenTeksDropdown) elemenTeksDropdown.textContent = "Pilih Nominal";
    } catch (error) {
      alert((error as Error).message);
    } finally {
      aturSedangMemuat(false);
    }
  };

  const tanganiProsesTransaksi = async () => {
    if (!dukunganAktif || !timestampBukaModal) return;

    const waktuBerlalu = Date.now() - timestampBukaModal;
    if (waktuBerlalu < 35000) {
        aturApakahModalPeringatanTerbuka(true);
        return;
    }

    aturSedangProsesTransaksi(true);
    try {
        const respons = await fetch('/api/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                aksi: 'updateStatus',
                kunciEntri: dukunganAktif.idFaktur,
                statusBaru: 'Di Proses'
            }),
        });
        const hasil = await respons.json();
        if (!respons.ok) { throw new Error(hasil.message || 'Gagal memproses transaksi.'); }
        alert(hasil.message);
        aturApakahModalQrisTerbuka(false);
    } catch (error) {
        alert((error as Error).message);
    } finally {
        aturSedangProsesTransaksi(false);
    }
  };

  const tanganiUnduhInvoice = () => {
    if (!dukunganAktif) return;
    const tombol = document.getElementById('tombol-unduh-invoice') as HTMLButtonElement;
    if (tombol) { tombol.textContent = 'Membuat...'; tombol.disabled = true; }
    
    const elemenInvoice = document.getElementById('wadah-invoice');
    const elemenGambarQr = document.getElementById('kode-qr-invoice');

    if (elemenGambarQr && elemenInvoice) {
      const gambar = new Image();
      gambar.crossOrigin = "anonymous";
      gambar.onload = () => {
        elemenGambarQr.innerHTML = '';
        elemenGambarQr.appendChild(gambar);
        setTimeout(() => {
          html2canvas(elemenInvoice, { scale: 2, useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Invoice-${dukunganAktif.idFaktur}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            if (tombol) { tombol.textContent = 'Download Invoice'; tombol.disabled = false; }
          }).catch(err => {
            console.error("html2canvas error:", err);
            if (tombol) { tombol.textContent = 'Download Invoice'; tombol.disabled = false; }
          });
        }, 100);
      };
      gambar.onerror = () => { if (tombol) { tombol.textContent = 'Download Invoice'; tombol.disabled = false; } };
      gambar.src = dukunganAktif.urlPembayaran;
    }
  };

  const KomponenInvoiceTersembunyi: FC<{ dataDukungan: DukunganAktif | null }> = ({ dataDukungan }) => {
    if (!dataDukungan) return null;
    return (
      <div id="wadah-invoice">
        <div className="kepala-invoice"><h2>INVOICE PEMBAYARAN</h2><p>Untuk: <strong>Sahrul</strong></p></div>
        <div className="detail-invoice">
          <table><tbody>
            <tr><td>No. Invoice:</td><td>{dataDukungan.idFaktur}</td></tr>
            <tr><td>Tanggal:</td><td>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td>Jatuh Tempo:</td><td>Bayar Segera</td></tr>
          </tbody></table>
        </div>
        <div className="badan-invoice">
          <p>Scan QR Code di bawah ini:</p>
          <div id="kode-qr-invoice"></div>
        </div>
        <div className="detail-pembayaran-invoice">
          <table><tbody>
            <tr><td>Jumlah Dukungan:</td><td>{formatMataUang(dataDukungan.jumlah)}</td></tr>
            <tr><td>Biaya Layanan:</td><td>{formatMataUang(dataDukungan.biaya)}</td></tr>
            <tr className="baris-total"><td>TOTAL BAYAR:</td><td>{formatMataUang(dataDukungan.total)}</td></tr>
          </tbody></table>
        </div>
        <div className="kaki-invoice"><p>Terima kasih atas dukungan Anda!</p></div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Halaman Dukungan - Awu</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/jpeg" href="/gambar.jpg" />
      </Head>
      <div className="wadah">
        <div className="konten-utama">
          <div className="kepala">
              <button className="tombol-kepala" onClick={() => aturApakahModalRiwayatTerbuka(true)}>Riwayat</button>
              <img src="/gambar.jpg" alt="Profile" className="gambar-profil"/>
              <div className="nama-merek">Awu</div>
          </div>
          <div className="wadah-formulir">
              <form onSubmit={tanganiKirimFormulir}>
                  <div className="grup-formulir">
                      <label>Nominal Dukungan: <span className="wajib">*</span></label>
                      <div className="dropdown">
                          <button type="button" className="pemantik-turun" onClick={() => aturApakahDropdownTerbuka(!apakahDropdownTerbuka)}>
                              <span id="teks-pemantik-jumlah">Pilih Nominal</span>
                              <span>▼</span>
                          </button>
                          <div className={`menu-turun ${apakahDropdownTerbuka ? 'tampil' : ''}`}>
                              {[1000, 5000, 10000, 25000, 50000].map(jumlah => (
                                  <div key={jumlah} className="item-turun" onClick={() => tanganiPerubahanJumlah(jumlah, formatMataUang(jumlah))}>
                                      {formatMataUang(jumlah)}
                                  </div>
                              ))}
                              <div className="item-turun" onClick={() => tanganiPerubahanJumlah('custom', 'Nominal Lain')}>
                                  Nominal Lain
                              </div>
                          </div>
                      </div>
                      {apakahKustom && (
                          <input type="text" className="input-formulir jumlah-kustom" placeholder="Ketik nominal (min. 1.000)" value={jumlahKustom} onChange={tanganiInputJumlahKustom} />
                      )}
                  </div>
                  <div className="grup-formulir"><label htmlFor="fromInput">Nama Anda: <span className="wajib">*</span></label><input type="text" id="fromInput" className="input-formulir" placeholder="Contoh: Budi" value={nama} onChange={e => aturNama(e.target.value)} required /></div>
                  <div className="grup-formulir"><label htmlFor="emailInput">Email: <span className="wajib">*</span></label><input type="email" id="emailInput" className="input-formulir" placeholder="Contoh: budi@example.com" value={email} onChange={e => aturEmail(e.target.value)} required /></div>
                  <div className="grup-formulir"><label htmlFor="messageInput">Pesan (Opsional):</label><input type="text" id="messageInput" className="input-formulir" placeholder="Contoh: Semoga selalu berkarya!" value={pesan} onChange={e => aturPesan(e.target.value)} /></div>
                  <div className="grup-centang"><div className="item-centang"><input type="checkbox" id="age-check" checked={setujuUmur} onChange={(e) => aturSetujuUmur(e.target.checked)} required /><label htmlFor="age-check">Saya berusia 17 tahun atau lebih</label></div><div className="item-centang"><input type="checkbox" id="terms-check" checked={setujuSyarat} onChange={(e) => aturSetujuSyarat(e.target.checked)} required /><label htmlFor="terms-check">Saya memahami dan menyetujui bahwa dukungan ini bersifat sukarela dan sesuai <a href="#" target="_blank" rel="noopener noreferrer">syarat & ketentuan</a>.</label></div></div>
                  <div className="ringkasan-pembayaran"><div className="baris-ringkasan"><span>Jumlah Dukungan:</span><span>{formatMataUang(jumlahDukungan)}</span></div><div className="baris-ringkasan"><span>Biaya Layanan:</span><span>{formatMataUang(biayaLayanan)}</span></div><div className="baris-ringkasan"><span>Total Bayar:</span><span>{formatMataUang(totalBayar)}</span></div></div>
                  <button type="submit" className="tombol-dukung" disabled={sedangMemuat}>{sedangMemuat ? 'Memproses...' : 'Lanjutkan Pembayaran'}</button>
              </form>
          </div>
        </div>
        <footer className="kaki-utama">Made with 💙 from Awu.my.id</footer>
      </div>
      {apakahModalQrisTerbuka && dukunganAktif && (
        <div className={`modal ${apakahModalQrisTerbuka ? 'aktif' : ''}`} onClick={() => aturApakahModalQrisTerbuka(false)}>
            <div className="konten-modal" onClick={e => e.stopPropagation()}>
                <div className="kepala-modal"><h3 className="judul-modal">Pembayaran QRIS</h3><button type="button" className="tutup-modal" onClick={() => aturApakahModalQrisTerbuka(false)}>&times;</button></div>
                {hitungMundur > 0 ? (
                    <p className="detail-pembayaran">Scan untuk membayar sebesar <span className="jumlah">{formatMataUang(dukunganAktif.total)}</span><br/>dalam waktu <span className="pewaktu">{Math.floor(hitungMundur / 60)}:{(hitungMundur % 60).toString().padStart(2, '0')}</span> lagi.</p>
                ) : (
                    <p className="detail-pembayaran">Waktu pembayaran habis.</p>
                )}
                <img src={dukunganAktif.urlPembayaran} alt="QRIS Payment Code" width="200" height="200" style={{opacity: hitungMundur > 0 ? 1 : 0.2}}/>
                <div className="kaki-modal">
                    <button type="button" className="tombol-modal" id="tombol-proses-transaksi" onClick={tanganiProsesTransaksi} disabled={hitungMundur === 0 || sedangProsesTransaksi}>{sedangProsesTransaksi ? 'Memproses...' : 'Proses Transaksi'}</button>
                    <button type="button" className="tombol-modal" id="tombol-unduh-invoice" onClick={tanganiUnduhInvoice} disabled={hitungMundur === 0}>Download Invoice</button>
                </div>
            </div>
        </div>
      )}
      {apakahModalRiwayatTerbuka && (
          <div className={`modal ${apakahModalRiwayatTerbuka ? 'aktif' : ''}`} onClick={() => aturApakahModalRiwayatTerbuka(false)}>
              <div className="konten-modal" onClick={e => e.stopPropagation()}>
                  <div className="kepala-modal"><h3 className="judul-modal">Riwayat Dukunganmu</h3><button type="button" className="tutup-modal" onClick={() => aturApakahModalRiwayatTerbuka(false)}>&times;</button></div>
                  <ul id="daftar-riwayat">
                      {riwayat.length > 0 ? riwayat.map((item, indeks) => (
                          <li key={indeks}>
                              <p><strong>{item.nama}</strong> mendukung sebesar <strong>{formatMataUang(item.jumlah)}</strong></p>
                              <p><em>"{item.pesan}"</em></p>
                              <p className="meta-riwayat">{new Date(item.tanggal).toLocaleString('id-ID')}</p>
                          </li>
                      )) : <p>Belum ada riwayat dukungan.</p>}
                  </ul>
              </div>
          </div>
      )}
      {apakahModalPeringatanTerbuka && (
        <div className={`modal ${apakahModalPeringatanTerbuka ? 'aktif' : ''}`} onClick={() => aturApakahModalPeringatanTerbuka(false)}>
            <div className="konten-modal" onClick={e => e.stopPropagation()}>
                <div className="kepala-modal"><h3 className="judul-modal">Peringatan</h3><button type="button" className="tutup-modal" onClick={() => aturApakahModalPeringatanTerbuka(false)}>&times;</button></div>
                <p>Transaksi ini belum bisa diproses. Silakan lakukan pembayaran terlebih dahulu.</p>
                <div className="kaki-modal" style={{gridTemplateColumns: '1fr'}}>
                    <button type="button" className="tombol-modal" onClick={() => aturApakahModalPeringatanTerbuka(false)}>Mengerti</button>
                </div>
            </div>
        </div>
      )}
      <KomponenInvoiceTersembunyi dataDukungan={dukunganAktif} />
    </>
  );
};

export default HalamanDukungan;
