import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deauthUser, isAuthenticated } from "../utils/auth";
import { Button, Dropdown, Menu, Table, message } from "antd";
import { sanityClient } from "../lib/sanity/getClient";
import * as XLSX from 'xlsx';

const columns = [
  {
    title: 'Nama Relawan',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a className='text-rose-600 font-semibold'>{text}</a>,
  },
  {
    title: 'Alamat Tujuan',
    dataIndex: 'alamatTujuan',
    key: 'alamatTujuan',
  },
  {
    title: 'Nama yang Dikunjungi',
    dataIndex: 'namaYangDikunjungi',
    key: 'namaYangDikunjungi',
  },
  {
    title: 'Keterangan Kunjungan',
    dataIndex: 'keteranganKunjungan',
    key: 'keteranganKunjungan',
  },
  {
    title: 'Foto',
    dataIndex: 'foto',
    key: 'foto',
    render: (text) => <a href={text} target="_blank" className='text-rose-600 font-semibold'>Download Foto</a>,
  },
];

function Home() {
  const navigate = useNavigate();
  const relawan_iqbaldinda_user = (localStorage.getItem('relawan_iqbaldinda_user'));

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the sign-in page
      message.error("Kamu belum login. Silahkan login terlebir dahulu!");
      navigate("/");
    }
  }, [navigate]);

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

  const [isLoading, setIsLoading] = useState(true);
  const [serverData, setServerData] = useState({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchSanityData() {
      try {
        setIsLoading(true);
        const sanityData = await sanityClient.fetch(`*[_type == 'relawan-iqbaldinda']{
          _id, alamatTujuan, namaYangDikunjungi, keteranganKunjungan, fotoEksternal, "foto": foto.asset->url, geometry, user-> {name}
        }`);

        setServerData({
          data: sanityData,
          error: null,
          loading: false,
        });
      } catch (error) {
        setServerData({
          data: [],
          error: 'Error getting data. Please try again later.',
          loading: false,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSanityData();
  }, []);
  console.log('cek data kunjungan: ', serverData)

  let dataSource = [];
  if (serverData && serverData.data && serverData.data.length > 0) {
    dataSource = serverData.data
    .filter(item => item.user.name === relawan_iqbaldinda_user)
    .map((item) => ({
      key: item._id,
      name: item.user.name || "-",
      alamatTujuan: item.alamatTujuan || "-",
      namaYangDikunjungi: item.namaYangDikunjungi || "-",
      keteranganKunjungan: item.keteranganKunjungan || "-",
      foto: item.fotoEksternal || "-",
    }));
  }

  const rearrangeDataForExcel = () => {
    // Rearrange the data based on the column order
    const rearrangedData = dataSource.map((item, index) => {
      return {
        'No.': index + 1,
        'Nama Relawan': item.name,
        'Alamat Tujuan': item.alamatTujuan,
        'Nama yang Dikunjungi': item.namaYangDikunjungi,
        'Keterangan Kunjungan': item.keteranganKunjungan,
        'Foto': item.foto
      };
    });
  
    return rearrangedData;
  };  

  const downloadExcel = () => {
    const data = rearrangeDataForExcel(serverData.data);
    const volunteerName = data[0]?.['Nama Relawan'];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `relawan-iqbaldinda-Relawan-${volunteerName}.xlsx`);
  };

  const updatedColumns = columns.map((col) => ({
    ...col,
    width: col.width || 150, // Anda dapat menyesuaikan lebar default kolom
  }));
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
              Data Kunjungan
            </h1>

            <p className="mt-4 max-w-lg sm:text-xl/relaxed text-gray-700">
              Daftar rekap data titik kunjungan relawan.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-center">
            <Link
                to="/home"
                className="flex justify-center items-center w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
            >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.79889 24H41.7989" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.7988 36L5.79883 24L17.7988 12" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg> &nbsp; Kembali ke Home
            </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="list" className="text-gray-600 py-10 lg:px-36">
        <div className="flex justify-end mb-4 mr-2">
            <Button className="bg-green-600 text-white" onClick={downloadExcel}>Download Excel</Button>
        </div>
        <Table className='font-normal' columns={columns} dataSource={dataSource} loading={isLoading} scroll={{ x: 'max-content' }}/>

        {/* <div className="text-center mt-10">
          <a href="#hero" className="text-rose-700">Back to Top</a>
        </div> */}
      </section>
    </>
  )
}

export default Home