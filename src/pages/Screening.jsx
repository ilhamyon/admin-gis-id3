import { Button, Dropdown, Menu, Modal, Radio, Select, message } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity/getClient";
import { deauthUser, isAuthenticated } from "../utils/auth";
import BeresikoRendah from "../components/BeresikoRendah";
import BeresikoSedang from "../components/BeresikoSedang";
import BeresikoTinggi from "../components/BeresikoTinggi";
import Pubertas from "../assets/pubertas.png";
import Jerawat from "../assets/jerawat.png";
import MimpiBasah from "../assets/mimpibasah.png";
import Menstruasi from "../assets/menstruasi.png";
import Menstruasi2 from "../assets/menstruasi2.png";
import Reproduksi from "../assets/reproduksi.png";
import Reproduksi2 from "../assets/reproduksi2.png";
import KekerasanSeks from "../assets/cegahkekerasanseks.png";
import KekerasanSeks2 from "../assets/cegahkekerasanseks2.png";
import HindariSeks from "../assets/hindariseks.png";
import HindariSeks2 from "../assets/hindariseks2.png";
import InfeksiMenular from "../assets/infeksimenular.png";
import KankerServiks from "../assets/kankerserviks.png";
import Hiv from "../assets/hiv.png";
import Hiv2 from "../assets/hiv2.png";

function Screening() {
  const navigate = useNavigate();
  const relawan_iqbaldinda_id = (localStorage.getItem('relawan_iqbaldinda_id'));

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the sign-in page
      message.error("Kamu belum login. Silahkan login terlebir dahulu!");
      navigate("/");
    }
  }, [navigate]);

  const [serverData, setServerData] = useState({
    data: [],
    error: null,
    loading: true,
  });

  async function fetchSanityData() {
    try {
      const sanityData = await sanityClient.fetch(`*[_type == 'screening']{
        _id,
        user,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,

      }`);

      const filteredData = sanityData.filter(item => item.user?._ref === relawan_iqbaldinda_id);

      setServerData({
        data: filteredData,
        error: null,
        loading: false,
      });
    } catch (error) {
      setServerData({
        data: [],
        error: 'Error getting data. Please try again later.',
        loading: false,
      });
    }
  }

  useEffect(() => {
    fetchSanityData();
  }, []);
  console.log('cek data screening: ', serverData)

  const createScreening = async (relawan_iqbaldinda_userData) => {
    // eslint-disable-next-line no-unused-vars
    const { Option } = Select;
    try {
      const response = await fetch(`https://ln9ujpru.api.sanity.io/v2021-03-25/data/mutate/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer skAdQo8vEzaH81Ah4n2X8QDNsgIfdWkJlLmbo3CbT6Nt3nW7iTLx2roYCOm9Rlp1mQV2nEEGCqf4aGSMaJx67iK5PZPe7CgmI9Lx9diRdq0ssoRzl1LhiUFXHQmKu0utxgBa1ttoKwat3KIFt2B5vskrT82ekR5B8sbSzE51VjZHy3T7Q62P`,
        },
        body: JSON.stringify({
          mutations: [
            {
              create: {
                _type: 'screening', // Ganti dengan jenis dokumen pengguna di Sanity Anda
                user: {
                  _type: 'reference',
                  _ref: relawan_iqbaldinda_id // Assuming relawan_iqbaldinda_userData.userId contains the ID of the user document
                },
                question1: relawan_iqbaldinda_userData.question1,
                question2: relawan_iqbaldinda_userData.question2,
                question3: relawan_iqbaldinda_userData.question3,
                question4: relawan_iqbaldinda_userData.question4,
                question5: relawan_iqbaldinda_userData.question5,
                question6: relawan_iqbaldinda_userData.question6,
                question7: relawan_iqbaldinda_userData.question7,
                question8: relawan_iqbaldinda_userData.question8,
              },
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user in Sanity');
      }
  
      const data = await response.json();
      console.log('User created:', data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const [formData, setFormData] = useState({
    user: {
      _type: 'reference',
      _ref: relawan_iqbaldinda_id
    },
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    question7: '',
    question8: '',
  });

  console.log(formData);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Send POST request to your Sanity backend to create a new user
      await createScreening(formData);
      await updateSanityUser(formUpdate);

      message.success("Screening berhasil disimpan.")
      fetchSanityData();

    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  const [conclusion, setConclusion] = useState('');

  useEffect(() => {
    let newConclusion = '';

    if (serverData.data.length > 0) {
      if (serverData.data[0]?.question6 === true || serverData.data[0]?.question7 === true) {
        newConclusion = 'Tinggi';
      } else if (serverData.data[0]?.question8 === true) {
        newConclusion = 'Berat';
      } else if (serverData.data[0]?.question3 === true || serverData.data[0]?.question4 === true || serverData.data[0]?.question5 === true) {
        newConclusion = 'Sedang';
      } else if (serverData.data[0]?.question1 === true || serverData.data[0]?.question2 === true) {
        newConclusion = 'Ringan';
      } else {
        newConclusion = 'Tidak Beresiko';
      }
    } else {
      newConclusion = 'Tidak Beresiko';
    }

    setConclusion(newConclusion);
    updateSanityUser(newConclusion);
  }, [serverData]);

  const documentId = serverData.data[0]?._id;

  const deleteScreening = async () => {
    try {
      const response = await fetch(`https://ln9ujpru.api.sanity.io/v2021-03-25/data/mutate/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer skAdQo8vEzaH81Ah4n2X8QDNsgIfdWkJlLmbo3CbT6Nt3nW7iTLx2roYCOm9Rlp1mQV2nEEGCqf4aGSMaJx67iK5PZPe7CgmI9Lx9diRdq0ssoRzl1LhiUFXHQmKu0utxgBa1ttoKwat3KIFt2B5vskrT82ekR5B8sbSzE51VjZHy3T7Q62P`,
        },
        body: JSON.stringify({
          mutations: [
            {
              delete: {
                id: documentId, // ID dari dokumen screening yang ingin dihapus
              },
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete screening in Sanity');
      }
  
      const data = await response.json();
      console.log('Screening deleted:', data);
    } catch (error) {
      console.error('Error deleting screening:', error);
    }
  };
  
  const handleDeleteScreening = async () => {
    try {
      // Panggil fungsi deleteScreening dengan ID screening yang ingin dihapus
      await deleteScreening();
      // Tambahkan log atau fungsi lain yang Anda butuhkan setelah penghapusan berhasil
      console.log('Screening berhasil dihapus.');
      window.location.reload();
    } catch (error) {
      // Tangani kesalahan jika penghapusan gagal
      console.error('Terjadi kesalahan saat menghapus screening:', error);
    }
  };
  
  const updateSanityUser = async (conclusion) => {
    // eslint-disable-next-line no-unused-vars
    const { Option } = Select;
    try {
      const response = await fetch(`https://ln9ujpru.api.sanity.io/v2021-03-25/data/mutate/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer skAdQo8vEzaH81Ah4n2X8QDNsgIfdWkJlLmbo3CbT6Nt3nW7iTLx2roYCOm9Rlp1mQV2nEEGCqf4aGSMaJx67iK5PZPe7CgmI9Lx9diRdq0ssoRzl1LhiUFXHQmKu0utxgBa1ttoKwat3KIFt2B5vskrT82ekR5B8sbSzE51VjZHy3T7Q62P`,
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: relawan_iqbaldinda_id, // The _id of the document to update
                set: {
                  resiko: conclusion,
                },
              },
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user in Sanity');
      }
  
      const data = await response.json();
      console.log('User created:', data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const [formUpdate, setFormUpdate] = useState({
    resiko: conclusion,
  });

  const gradientStyle = {
    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.95), transparent)',
    position: 'absolute',
    inset: '0'
  };

  const menu = (
    <Menu>
      <Menu.Item key="signout" onClick={deauthUser}>Logout</Menu.Item>
    </Menu>
  );

  const [visible, setVisible] = useState(false);
  const [modalContentId, setModalContentId] = useState(null);

  const handleOpenModal = (id) => {
    setModalContentId(id);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setModalContentId(null); // Reset modal content id when modal is closed
  };
  return (
    <>
      <section id="hero" className="relative bg-[url(https://ik.imagekit.io/tvlk/blog/2021/03/Mandalika.jpg)] bg-cover bg-center bg-no-repeat">
        <div style={gradientStyle}></div>

        <div className="absolute right-0 p-6">
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="12" r="8" fill="#333" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Dropdown>
        </div>

        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div className="max-w-xl text-center sm:text-left">
            <h1 className="text-3xl font-extrabold sm:text-5xl text-gray-800">
              Screening
              <strong className="block font-extrabold text-rose-700"> Perilaku Seksual </strong>
            </h1>

            <p className="mt-4 max-w-lg sm:text-xl/relaxed text-gray-700">
              Melakukan screening dan mengetahui presentase perilaku seksual.
            </p>

            {/* <div className="mt-8 flex flex-wrap gap-4 text-center">
            <Link
                to="/home"
                className="flex justify-center items-center w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
            >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.79889 24H41.7989" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.7988 36L5.79883 24L17.7988 12" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg> &nbsp; Kembali ke Home
            </Link>
            </div> */}
          </div>
        </div>
      </section>

      {serverData.data.length > 0 ? null :
        <section>
          <div className="lg:flex justify-center">
            <div className="lg:py-0 py-10 flex items-center">
              <form className="w-full lg:px-20 px-4 items-center" onSubmit={handleSubmit}>
                <h2 className="font-bold text-center text-[18px] lg:text-4xl mb-10 mt-16 text-gray-900 uppercase">Screening Prilaku Seksual</h2>
                <div className="flex flex-col gap-2 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">1. Ingin dielus atau mengelus pacar/pasangan bagian tubuh tertentu</label>
                  <Radio.Group
                    value={formData.question1}
                    onChange={(e) => setFormData({ ...formData, question1: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">2. Melakukan keisengan lawan jenis dengan kata-kata (ada hati)</label>
                  <Radio.Group
                    value={formData.question2}
                    onChange={(e) => setFormData({ ...formData, question2: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">3. Merayu sesama jenis (ada hasrat seksual)</label>
                  <Radio.Group
                    value={formData.question3}
                    onChange={(e) => setFormData({ ...formData, question3: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">4. Pernah bersama-sma melakukan (jalan-jalan, makan, selfie, ngobrol) dengan pasangan</label>
                  <Radio.Group
                    value={formData.question4}
                    onChange={(e) => setFormData({ ...formData, question4: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">5. Menonton pornografi bersama teman</label>
                  <Radio.Group
                    value={formData.question5}
                    onChange={(e) => setFormData({ ...formData, question5: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">6. Menyentuh bibir dengan pacar/pasangan</label>
                  <Radio.Group
                    value={formData.question6}
                    onChange={(e) => setFormData({ ...formData, question6: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="py-4 flex flex-col gap-4 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">7. Ingin melakukan kontak fisik bagian bibir pacar/pasangan</label>
                  <Radio.Group
                    value={formData.question7}
                    onChange={(e) => setFormData({ ...formData, question7: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>

                <div className="py-4 flex flex-col gap-4 border-b-[1px] border-gray-200 pb-2">
                  <label className="text-gray-700">8. Pernah merangsang alat kelamin sendiri</label>
                  <Radio.Group
                    value={formData.question8}
                    onChange={(e) => setFormData({ ...formData, question8: e.target.value })}
                  >
                      <Radio value={true}>Pernah</Radio>
                      <Radio value={false}>Tidak</Radio>
                  </Radio.Group>
                </div>
                
                <Button
                  className="text-white bg-rose-700 w-full mt-8"
                  htmlType="submit"
                  size="large"
                >
                  Submit
                </Button>
                <p className="flex justify-center text-sm font-light py-10 text-gray-500">
                  <a href="#hero" className="text-rose-700"> Back to Top</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      }

      {serverData.data.length === 0 ? null :
        <section className="text-gray-900 py-10">
          <h2 className="font-bold text-center text-[18px] lg:text-3xl mb-10 text-gray-900">
            {conclusion === 'Tidak Beresiko' ? 'Kamu saat ini' : 'Waw, kamu berada dalam kategori Perilaku Seksual Berisiko'} {conclusion}
          </h2>
          <div className="flex justify-center gap-6">
            <Button size="large" onClick={handleDeleteScreening}>Ulangi Screening</Button>
          </div>
          <div className="flex justify-center py-10 mt-10">
            {(conclusion === "Tidak Beresiko" || conclusion === "Ringan") &&
              <>
                <div className="flex flex-col justify-center">
                  <BeresikoRendah />
                  <div className="flex justify-center gap-6 mt-14">
                    <Button size="large" onClick={() => handleOpenModal("TerapiSeft")}>Ayok Nonton terapi SEFT</Button>
                    <a href="https://wa.me/6285242426909?text=Hi%2C%20Saya%20ingin%20konsultasi" target="_blank">
                    <Button size="large" className="bg-green-500 text-white flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#333" x="0px" y="0px" width="22" height="22" viewBox="0 0 50 50">
                        <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z"></path>
                      </svg>
                      Yuk !! Jika butuh konsultasi
                    </Button>
                    </a>
                  </div>
                  <div className="flex justify-center gap-6 mt-8">
                    <Button size="large" onClick={() => handleOpenModal("KekerasanSeks")}>Cegah Kekerasan Seksual</Button>
                  </div>
                </div>
              </>
            }
            
            {conclusion === "Sedang" &&
              <>
                <div className="flex flex-col justify-center">
                  <BeresikoSedang />
                  <div className="flex justify-center gap-6 mt-14">
                    <Button size="large" onClick={() => handleOpenModal("TerapiSeft")}>Ayok Nonton terapi SEFT</Button>
                    <a href="https://wa.me/6285242426909?text=Hi%2C%20Saya%20ingin%20konsultasi" target="_blank">
                    <Button size="large" className="bg-green-500 text-white flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#333" x="0px" y="0px" width="22" height="22" viewBox="0 0 50 50">
                        <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z"></path>
                      </svg>
                      Yuk !! Jika butuh konsultasi
                    </Button>
                    </a>
                  </div>
                  <div className="flex justify-center gap-6 mt-8">
                    <Button size="large" onClick={() => handleOpenModal("Pubertas")}>Tahap Perkembangan remaja</Button>
                  </div>
                </div>
              </>
            }

            {(conclusion === "Tinggi" || conclusion === "Berat") &&
              <>
                <div className="flex flex-col justify-center">
                  <BeresikoTinggi />
                  <div className="flex justify-center gap-6 mt-14">
                    <Button size="large" onClick={() => handleOpenModal("TerapiSeft")}>Ayok Nonton terapi SEFT</Button>
                    <a href="https://wa.me/6285242426909?text=Hi%2C%20Saya%20ingin%20konsultasi" target="_blank">
                    <Button size="large" className="bg-green-500 text-white flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#333" x="0px" y="0px" width="22" height="22" viewBox="0 0 50 50">
                        <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z"></path>
                      </svg>
                      Yuk !! Jika butuh konsultasi
                    </Button>
                    </a>
                  </div>
                  <div className="flex justify-center gap-6 mt-8">
                    <Button size="large" onClick={() => handleOpenModal("Pubertas")}>Tahap Perkembangan remaja</Button>
                    <Button size="large" onClick={() => handleOpenModal("Reproduksi2")}>Kesehatan reproduksi</Button>
                    <Button size="large" onClick={() => handleOpenModal("KekerasanSeks")}>Cegah kekerasan Seksual</Button>
                  </div>
                </div>
              </>
            }
          </div>
          <Modal
            title=""
            visible={visible}
            onCancel={handleCloseModal}
            footer={[
              <Button key="cancel" onClick={handleCloseModal}>
                Tutup
              </Button>
            ]}
            centered
            width={800}
          >
            <div className="mt-6" style={{ overflow: 'auto', maxHeight: '560px', width: '100%', display: 'flex' }}>
              {modalContentId === "Pubertas" && 
              <div style={{ userSelect: 'none' }}>
                <img src={Pubertas} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
                <img src={Jerawat} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
                <img src={MimpiBasah} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
                <img src={Menstruasi2} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
              </div>
              }

              {modalContentId === "HindariSeks" && <img src={HindariSeks} alt="HindariSeks" />}
              {modalContentId === "InfeksiMenular" && <img src={InfeksiMenular} alt="InfeksiMenular" />}
              {modalContentId === "KekerasanSeks2" && <img src={KekerasanSeks2} alt="KekerasanSeks2" />}

              {modalContentId === "Reproduksi2" && 
              <div>
                <img src={Reproduksi2} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
              </div>
              }

              {modalContentId === "KekerasanSeks" &&
              <div>
                <img src={KekerasanSeks} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
                <img src={KekerasanSeks2} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
              </div>
              }

              {modalContentId === "TerapiSeft" &&
                <div>
                  <h3 className="py-6 text-2xl font-bold">Terapi Seft</h3>
                  <iframe width="750" height="421" src="https://www.youtube.com/embed/8PDy-J6mhTU?rel=0" frameBorder="0" allowfullscreen></iframe>
                </div>            
              }
            </div>
          </Modal>
        </section>
      }
    </>
  )
}

export default Screening