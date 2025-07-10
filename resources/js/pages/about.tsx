// resources/js/pages/about.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Sparkles, Target } from 'lucide-react';

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Home', href: route('home') }];

// Komponen untuk kartu fitur
const FeatureCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
    <div className="rounded-lg border border-border/80 bg-white p-6 shadow-sm dark:bg-card/80">
        <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
                <p className="mt-1 text-muted-foreground">{text}</p>
            </div>
        </div>
    </div>
);

// Komponen untuk kartu tim
const TeamMemberCard = ({ name, role, imgSrc }: { name: string; role: string; imgSrc: string }) => (
    <div className="text-center">
        <img
            src={imgSrc}
            alt={`Foto ${name}`}
            className="mx-auto h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-700"
        />
        <h4 className="mt-4 text-xl font-bold text-card-foreground">{name}</h4>
        <p className="text-primary">{role}</p>
    </div>
);

export default function AboutPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About Us" />

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Bagian Header */}
                <div className="rounded-xl border border-border/80 bg-card p-10 text-center shadow-lg">
                    <BookOpen className="mx-auto h-16 w-16 text-primary" />
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Tentang E-Book Store</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Kami adalah platform digital yang berdedikasi untuk menyebarkan pengetahuan dan imajinasi melalui buku digital berkualitas.
                    </p>
                </div>

                {/* Bagian Misi dan Visi */}
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FeatureCard
                        icon={<Target size={24} />}
                        title="Misi Kami"
                        text="Menyediakan akses mudah dan terjangkau ke berbagai macam e-book untuk semua kalangan, mendukung budaya literasi di era digital."
                    />
                    <FeatureCard
                        icon={<Sparkles size={24} />}
                        title="Visi Kami"
                        text="Menjadi jembatan utama antara penulis dan pembaca di seluruh Indonesia, menciptakan ekosistem literasi yang dinamis dan inklusif."
                    />
                </div>

                {/* Bagian Tim Kami */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Tim di Balik Layar</h2>
                    <p className="text-md mx-auto mt-4 max-w-xl text-muted-foreground">
                        Orang-orang penuh semangat yang membuat semua ini menjadi mungkin.
                    </p>
                    <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        <TeamMemberCard name="Adi Novendra Putra" role=" Part of the Aksara Bootcamp Batch 1" imgSrc="/assets/AdiNovendraPutra.jpg" />
                        <TeamMemberCard
                            name="Hafidz Hussein Vendra"
                            role=" Part of the Aksara Bootcamp Batch 1"
                            imgSrc="/assets/HafidzHusseinVendra.jpg"
                        />
                        <TeamMemberCard
                            name="Putri Rahayu Agustin"
                            role=" Part of the Aksara Bootcamp Batch 1"
                            imgSrc="/assets/PutriRahayuAgustin.jpg"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
