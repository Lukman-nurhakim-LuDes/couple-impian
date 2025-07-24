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

// Fungsi untuk mendapatkan URL gambar dari ID konten fetch
const getImageUrl = (contentFetchId) => {
    return `https://googleusercontent.com/file_content/0?contentFetchId=uploaded:${contentFetchId}`;
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
    'Monitor Event': 'Monitor-event.png-b7009ade-dad1-43ec-8363-29fefbd77e9d',
    'Aku': 'aku.png-7e124c76-1de2-454b-bef5-1c9fbb1bfa18',
    'Kamu': 'kamu.png-59ac26c5-fe8e-4961-9f2f-8fd1e1efc913',
};

// Main App component
const App = () => {
    const [currentPage, setCurrentPage] = React.useState('Monitor Event');
    const [userId, setUserId] = React.useState(null);
    const [isAuthReady, setIsAuthReady] = React.useState(false);

    React.useEffect(() => {
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

                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setUserId(user.uid);
                    } else {
                        setUserId(crypto.randomUUID());
                    }
                    setIsAuthReady(true);
                });

                return () => unsubscribe();
            } else {
                setUserId(crypto.randomUUID());
                setIsAuthReady(true);
            }
        };

        initFirebaseAndAuth();
    }, []);

    const featureContent = {
        'Dasbor': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Selamat Datang di Dasbor Anda!'),
            React.createElement('p', null, 'Ini adalah ringkasan aktivitas Anda.'),
            userId && React.createElement('p', { className: 'mt-4 text-sm text-gray-600' }, `ID Pengguna: ${userId}`)
        ),
        'Keuangan': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Manajemen Keuangan'),
            React.createElement('p', null, 'Kelola pemasukan dan pengeluaran Anda di sini.')
        ),
        'Tabungan': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Rencana Tabungan'),
            React.createElement('p', null, 'Lacak tujuan tabungan Anda.')
        ),
        'Game': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Waktu Bermain!'),
            React.createElement('p', null, 'Nikmati berbagai permainan di sini.')
        ),
        'Pasangan': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Fitur Pasangan'),
            React.createElement('p', null, 'Kelola jadwal atau aktivitas bersama pasangan Anda.')
        ),
        'Kalender': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Kalender & Jadwal'),
            React.createElement('p', null, 'Lihat dan atur acara Anda.')
        ),
        'Habits': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Pelacak Kebiasaan'),
            React.createElement('p', null, 'Bangun kebiasaan baik Anda.')
        ),
        'Pic Drop': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Galeri Foto'),
            React.createElement('p', null, 'Simpan dan lihat momen-momen Anda.')
        ),
        'Wishlist': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Daftar Keinginan'),
            React.createElement('p', null, 'Buat daftar keinginan dan impian Anda.')
        ),
        'Monitor Event': React.createElement('div', { className: 'p-4 text-center' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Monitor Event'),
            React.createElement('p', null, 'Lihat semua aktivitas ataupun event yang dibuat di sini.')
        ),
    };

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    return React.createElement(
        'div',
        {
            className: 'min-h-screen font-sans flex flex-col items-center p-4 bg-cover bg-center',
            style: { backgroundImage: `url(${getImageUrl('Background.jpg-009aaa04-4b2b-4921-b937-a0f717a496ec')})` }
        },
        React.createElement(
            'header',
            { className: 'w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 mb-8 text-center flex items-center justify-center relative' },
            React.createElement('img', {
                src: getImageUrl(iconMap['Aku']),
                alt: 'Ikon Aku',
                className: 'icon-header absolute left-4 top-1/2 -translate-y-1/2',
                onError: (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/cccccc/333333?text=Aku'; }
            }),
            React.createElement('div', null,
                React.createElement('h1', { className: 'text-4xl font-extrabold text-indigo-700 mb-2' }, 'Couple GrowUp'),
                React.createElement('p', { className: 'text-lg text-gray-600' }, 'Petualangan Menuju Impian')
            ),
            React.createElement('img', {
                src: getImageUrl(iconMap['Kamu']),
                alt: 'Ikon Kamu',
                className: 'icon-header absolute right-4 top-1/2 -translate-y-1/2',
                onError: (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/cccccc/333333?text=Kamu'; }
            })
        ),
        React.createElement(
            'main',
            { className: 'w-full max-w-4xl flex flex-col lg:flex-row gap-6' },
            React.createElement(
                'div',
                { className: 'flex flex-col w-full lg:w-1/4 gap-4' },
                React.createElement(
                    'div',
                    { className: 'feature-button-large', onClick: () => navigateTo('Keuangan') },
                    React.createElement('img', {
                        src: getImageUrl(iconMap['Keuangan']),
                        alt: 'Ikon Keuangan',
                        className: 'icon-large mb-2',
                        onError: (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Keuangan'; }
                    }),
                    React.createElement('span', { className: 'text-lg font-semibold text-gray-800' }, 'Keuangan')
                ),
                React.createElement(
                    'div',
                    { className: 'feature-button-large', onClick: () => navigateTo('Tabungan') },
                    React.createElement('img', {
                        src: getImageUrl(iconMap['Tabungan']),
                        alt: 'Ikon Tabungan',
                        className: 'icon-large mb-2',
                        onError: (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Tabungan'; }
                    }),
                    React.createElement('span', { className: 'text-lg font-semibold text-gray-800' }, 'Tabungan')
                )
            ),
            React.createElement(
                'div',
                { className: 'flex-grow w-full lg:w-2/4 bg-white rounded-2xl shadow-xl p-6 flex items-center justify-center min-h-[300px] lg:min-h-[500px]' },
                featureContent[currentPage]
            ),
            React.createElement(
                'div',
                { className: 'flex flex-col w-full lg:w-1/4 gap-4' },
                React.createElement(
                    'div',
                    { className: 'feature-button-large', onClick: () => navigateTo('Game') },
                    React.createElement('img', {
                        src: getImageUrl(iconMap['Game']),
                        alt: 'Ikon Game',
                        className: 'icon-large mb-2',
                        onError: (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Game'; }
                    }),
                    React.createElement('span', { className: 'text-lg font-semibold text-gray-800' }, 'Game')
                ),
                React.createElement(
                    'div',
                    { className: 'feature-button-large', onClick: () => navigateTo('Pasangan') },
                    React.createElement('img', {
                        src: getImageUrl(iconMap['Pasangan']),
                        alt: 'Ikon Pasangan',
                        className: 'icon-large mb-2',
                        onError: (e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/cccccc/333333?text=Pasangan'; }
                    }),
                    React.createElement('span', { className: 'text-lg font-semibold text-gray-800' }, 'Pasangan')
                )
            )
        ),
        React.createElement(
            'nav',
            { className: 'w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4 mt-8 flex flex-wrap justify-around items-center gap-4' },
            ['Dasbor', 'Kalender', 'Habits', 'Pic Drop', 'Wishlist'].map((feature) =>
                React.createElement(
                    'div',
                    {
                        key: feature,
                        className: 'feature-button flex-1 min-w-[100px] max-w-[150px]',
                        onClick: () => navigateTo(feature)
                    },
                    React.createElement('img', {
                        src: getImageUrl(iconMap[feature]),
                        alt: `Ikon ${feature}`,
                        className: 'icon-small mb-1',
                        onError: (e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/cccccc/333333?text=${feature.replace(' ', '')}`; }
                    }),
                    React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, feature)
                )
            )
        )
    );
};

// Render the App component
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
