import Pubertas from "../assets/pubertas.png";
import Jerawat from "../assets/jerawat.png";
import MimpiBasah from "../assets/mimpibasah.png";
import Menstruasi from "../assets/menstruasi.png";
import Reproduksi from "../assets/reproduksi.png";

function BeresikoRendah() {
  return (
    <div style={{ userSelect: 'none' }}>
        <img src={Pubertas} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={Jerawat} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={MimpiBasah} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={Menstruasi} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={Reproduksi} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
    </div>
  )
}

export default BeresikoRendah