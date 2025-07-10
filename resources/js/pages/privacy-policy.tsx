// resources/js/pages/privacy-policy.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, ShieldCheck } from 'lucide-react';

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Home', href: route('home') }];

// Komponen untuk setiap seksi kebijakan
const PolicySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="mb-3 flex items-center text-2xl font-bold text-foreground">
            <ShieldCheck className="mr-3 h-6 w-6 text-primary" />
            {title}
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">{children}</div>
    </div>
);

export default function PrivacyPolicyPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Privacy Policy" />

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header Halaman */}
                <div className="mb-12 rounded-xl border border-border/80 bg-card p-10 text-center shadow-lg">
                    <FileText className="mx-auto h-16 w-16 text-primary" />
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Kebijakan Privasi</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Terakhir diperbarui: 8 Juli 2024</p>
                </div>

                {/* Konten Kebijakan */}
                <div className="rounded-lg border border-border/80 bg-card p-8 sm:p-10">
                    <PolicySection title="Pengantar">
                        <p>
                            Selamat datang di E-Book Store. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan
                            privasi ini akan menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan
                            layanan kami.
                        </p>
                    </PolicySection>

                    <PolicySection title="Informasi yang Kami Kumpulkan">
                        <p>
                            Kami dapat mengumpulkan beberapa jenis informasi untuk berbagai tujuan guna menyediakan dan meningkatkan layanan kami
                            kepada Anda:
                        </p>
                        <ul>
                            <li>
                                <strong>Data Pribadi:</strong> Saat Anda mendaftar atau bertransaksi, kami mungkin meminta Anda untuk memberikan
                                informasi identifikasi pribadi seperti nama, alamat email, dan informasi kontak lainnya.
                            </li>
                            <li>
                                <strong>Data Transaksi:</strong> Kami mengumpulkan detail transaksi yang Anda lakukan melalui platform kami, termasuk
                                produk yang dibeli dan metode pembayaran.
                            </li>
                            <li>
                                <strong>Data Penggunaan:</strong> Kami secara otomatis mengumpulkan informasi tentang bagaimana Anda mengakses dan
                                menggunakan layanan kami, seperti alamat IP, jenis browser, halaman yang Anda kunjungi, dan waktu yang dihabiskan di
                                halaman tersebut.
                            </li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="Bagaimana Kami Menggunakan Informasi Anda">
                        <p>Kami menggunakan data yang dikumpulkan untuk berbagai tujuan:</p>
                        <ul>
                            <li>Untuk menyediakan dan memelihara layanan kami.</li>
                            <li>Untuk mengelola akun Anda dan memproses transaksi Anda.</li>
                            <li>
                                Untuk berkomunikasi dengan Anda, termasuk mengirimkan pembaruan layanan dan materi promosi (dengan persetujuan Anda).
                            </li>
                            <li>Untuk memantau penggunaan layanan kami dan mendeteksi, mencegah, serta mengatasi masalah teknis.</li>
                            <li>Untuk meningkatkan pengalaman pengguna dan layanan kami.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="Keamanan Data">
                        <p>
                            Keamanan data Anda penting bagi kami. Kami menggunakan langkah-langkah keamanan komersial yang wajar untuk melindungi data
                            pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, perlu diingat bahwa tidak ada metode
                            transmisi melalui Internet atau metode penyimpanan elektronik yang 100% aman.
                        </p>
                    </PolicySection>

                    <PolicySection title="Hak Anda">
                        <p>
                            Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi yang kami miliki tentang Anda. Anda dapat
                            mengelola informasi akun Anda melalui halaman profil Anda atau dengan menghubungi kami secara langsung.
                        </p>
                    </PolicySection>

                    <PolicySection title="Perubahan pada Kebijakan Privasi Ini">
                        <p>
                            Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun
                            dengan memposting Kebijakan Privasi baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara
                            berkala untuk setiap perubahan.
                        </p>
                    </PolicySection>

                    <PolicySection title="Hubungi Kami">
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui email di:
                            support@ebookstore.com.
                        </p>
                    </PolicySection>
                </div>
            </div>
        </AppLayout>
    );
}
