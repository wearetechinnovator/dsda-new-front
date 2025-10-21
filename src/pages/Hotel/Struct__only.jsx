import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';


const Dashboard = () => {
  return (
    <>
      <Nav title={"Dashboard"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className="content__body__main">
            hello world
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard;