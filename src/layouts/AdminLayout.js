import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{
        marginLeft: 220,
        padding: "0px",
        width: "100%",
        height: "100%", 
        backgroundImage: `url("/images/Bgr_web.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        
      }}>
        {children}
      </div>
    </div>
  );
}
