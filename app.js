import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, query, where, addDoc, getDocs } from 'firebase/firestore';

// Global variables for Firebase config and app ID
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase outside of the component to avoid re-initialization
let app, db, auth;
if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
}

// Main App component
const App = () => {
    const [currentPage, setCurrentPage] = useState('Monitor Event'); // State untuk halaman yang sedang aktif, default ke Monitor Event
    const [userId, setUserId] = useState(null); // State untuk ID pengguna
    const [isAuthReady, setIsAuthReady] = useState(false); // State untuk menandakan otentikasi siap

    // Effect untuk inisialisasi Firebase dan otentikasi
    useEffect(() => {
        const initFirebaseAndAuth = async () => {
            if (app && auth) {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Error signing in:", error);
                }

                // Listen for auth state changes
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setUserId(user.uid);
                    } else {
                        setUserId(crypto.randomUUID()); // Fallback for anonymous or unauthenticated
                    }
                    setIsAuthReady(true); // Set auth ready after initial check
                });

                return () => unsubscribe(); // Cleanup listener on unmount
            } else {
                setUserId(crypto.randomUUID()); // Set a random ID if Firebase is not configured
                setIsAuthReady(true);
            }
        };

        initFirebaseAndAuth();
    }, []); // Run once on component mount

    // Data dummy untuk setiap fitur (akan diganti dengan data dari Firestore nanti)
    const featureContent = {
        'Dasbor': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Selamat Datang di Dasbor Anda!</h2>
                <p>Ini adalah ringkasan aktivitas Anda.</p>
                {userId && <p className="mt-4 text-sm text-gray-600">ID Pengguna: {userId}</p>}
            </div>
        ),
        'Keuangan': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Manajemen Keuangan</h2>
                <p>Kelola pemasukan dan pengeluaran Anda di sini.</p>
                {/* Placeholder for finance management UI */}
            </div>
        ),
        'Tabungan': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Rencana Tabungan</h2>
                <p>Lacak tujuan tabungan Anda.</p>
                {/* Placeholder for savings UI */}
            </div>
        ),
        'Game': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Waktu Bermain!</h2>
                <p>Nikmati berbagai permainan di sini.</p>
                {/* Placeholder for game UI */}
            </div>
        ),
        'Pasangan': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Fitur Pasangan</h2>
                <p>Kelola jadwal atau aktivitas bersama pasangan Anda.</p>
                {/* Placeholder for partner feature UI */}
            </div>
        ),
        'Kalender': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Kalender & Jadwal</h2>
                <p>Lihat dan atur acara Anda.</p>
                {/* Placeholder for calendar UI */}
            </div>
        ),
        'Habits': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Pelacak Kebiasaan</h2>
                <p>Bangun kebiasaan baik Anda.</p>
                {/* Placeholder for habits tracker UI */}
            </div>
        ),
        'Pic Drop': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Galeri Foto</h2>
                <p>Simpan dan lihat momen-momen Anda.</p>
                {/* Placeholder for photo gallery UI */}
            </div>
        ),
        'Wishlist': (
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Daftar Keinginan</h2>
                <p>Buat daftar keinginan dan impian Anda.</p>
                {/* Placeholder for wishlist UI */}
            </div>
        ),
        'Monitor Event': ( // Konten untuk fitur Monitor Event di tengah
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Monitor Event</h2>
                <p>Lihat semua aktivitas ataupun event yang dibuat di sini.</p>
                {/* Placeholder for event monitoring UI */}
            </div>
        ),
    };

    // Fungsi untuk mengubah halaman
    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    // Objek untuk memetakan nama fitur ke URL ikon
    const iconMap = {
        'Dasbor': 'Dasboard.png-c08212f9-e382-4ea6-aad3-963ea6c21cfc',
        'Keuangan': 'Keuangan.png-88ae531d-2354-473f-8df5-182c9446e253',
        'Tabungan': 'Tabungan.png-9e41643e-d7ef-41cc-9cee-838dbbbf2e5c',
        'Game': 'Game-time.png-e6a68a2b-d98b-48fa-b24f-af92b70f0145',
        'Pasangan': 'pasangan.jpg-74ef9965-99b5-47a2-a44f-18dfdd16b132',
        'Kalender': 'Calender.png-f713adef-8c8c-48fe-a163-3a27626232ad',
        'Habits': 'Habits.png-3847b4bc-8889-43c7-a2ba-7193ea1971b8',
        'Pic Drop': 'pic-drop.png-2cbb69f5-bcd3-419f-9582-465ecba93840',
        'Wishlist': 'wishlist.png-8c35dc3c-0673-4b4f-bc0e-de088a0a933b',
        'Monitor Event': 'Monitor-event.png-b7009ade-dad1-43ec-8363-29fefbd77e9d', // Tambahkan ikon untuk Monitor Event
        'Aku': 'aku.png-7e124c76-1de2-454b-bef5-1c9fbb1bfa18', // Ikon baru
        'Kamu': 'kamu.png-59ac26c5-fe8e-4961-9f2f-8fd1e1efc913', // Ikon baru
    };

    // Fungsi untuk mendapatkan URL gambar dari ID konten fetch
    const getImageUrl = (contentFetchId) => {
        return `http://googleusercontent.com/file_content/0?contentFetchId=uploaded:${contentFetchId}`;
    };

    return (
        <div
            className="min-h-screen font-sans flex flex-col items-center p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${getImageUrl('Background.jpg-009aaa04-4b2b-4921-b937-a0f717a496ec')})` }}
        >
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .feature-button {
                    @apply flex flex-col items-center justify-center p-3 m-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer;
                }
                .feature-button-large {
                    @apply flex flex-col items-center justify-center p-6 m-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer;
                }
                .icon-small {
                    width: 48px;
                    height: 48px;
                    object-fit: contain;
                }
                .icon-large {
                    width: 96px;
                    height: 96px;
                    object-fit: contain;
                }
                .icon-header {
                    width: 60px; /* Ukuran ikon di header */
                    height: 60px;
                    object-fit: contain;
                }
                `}
            </style>

            {/* Header Aplikasi */}
            <header className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 mb-8 text-center flex items-center justify-center relative">
                <img
                    src={getImageUrl(iconMap['Aku'])}
                    alt="Ikon Aku"
                    className="icon-header absolute left-4 top-1/2 -translate-y-1/2"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/cccccc/333333?text=Aku'; }}
                />
                <div>
                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Couple GrowUp</h1>
                    <p className="text-lg text-gray-600">Petualangan Menuju Impian</p>
                </div>
                <img
                    src={getImageUrl(iconMap['Kamu'])}
                    alt="Ikon Kamu"
                    className="icon-header absolute right-4 top-1/2 -translate-y-1/2"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/cccccc/333333?text=Kamu'; }}
                />
            </header>

            {/* Konten Utama Aplikasi */}
            <main className="w-full max-w-4xl flex flex-col lg:flex-row gap-6">
                {/* Kolom Kiri - Keuangan & Tabungan */}
                <div className="flex flex-col w-full lg:w-1/4 gap-4">
                    <div
                        className="feature-button-large"
                        onClick={() => navigateTo('Keuangan')}
                    >
                        <img
                            src={getImageUrl(iconMap['Keuangan'])}
                            alt="Ikon Keuangan"
                            className="icon-large mb-2"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Keuangan'; }}
                        />
                        <span className="text-lg font-semibold text-gray-800">Keuangan</span>
                    </div>
                    <div
                        className="feature-button-large"
                        onClick={() => navigateTo('Tabungan')}
                    >
                        <img
                            src={getImageUrl(iconMap['Tabungan'])}
                            alt="Ikon Tabungan"
                            className="icon-large mb-2"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Tabungan'; }}
                        />
                        <span className="text-lg font-semibold text-gray-800">Tabungan</span>
                    </div>
                </div>

                {/* Area Konten Tengah - Halaman Saat Ini (Monitor Event) */}
                <div className="flex-grow w-full lg:w-2/4 bg-white rounded-2xl shadow-xl p-6 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                    {featureContent[currentPage]}
                </div>

                {/* Kolom Kanan - Game & Pasangan */}
                <div className="flex flex-col w-full lg:w-1/4 gap-4">
                    <div
                        className="feature-button-large"
                        onClick={() => navigateTo('Game')}
                    >
                        <img
                            src={getImageUrl(iconMap['Game'])}
                            alt="Ikon Game"
                            className="icon-large mb-2"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Game'; }}
                        />
                        <span className="text-lg font-semibold text-gray-800">Game</span>
                    </div>
                    <div
                        className="feature-button-large"
                        onClick={() => navigateTo('Pasangan')}
                    >
                        <img
                            src={getImageUrl(iconMap['Pasangan'])}
                            alt="Ikon Pasangan"
                            className="icon-large mb-2"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Pasangan'; }}
                        />
                        <span className="text-lg font-semibold text-gray-800">Pasangan</span>
                    </div>
                </div>
            </main>

            {/* Navigasi Bawah Horizontal */}
            <nav className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4 mt-8 flex flex-wrap justify-around items-center gap-4">
                {['Dasbor', 'Kalender', 'Habits', 'Pic Drop', 'Wishlist'].map((feature) => (
                    <div
                        key={feature}
                        className="feature-button flex-1 min-w-[100px] max-w-[150px]"
                        onClick={() => navigateTo(feature)}
                    >
                        <img
                            src={getImageUrl(iconMap[feature])}
                            alt={`Ikon ${feature}`}
                            className="icon-small mb-1"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/cccccc/333333?text=${feature.replace(' ', '')}`; }}
                        />
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default App;
