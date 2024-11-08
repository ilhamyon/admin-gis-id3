import Reproduksi from "../assets/reproduksi2.png";
import KekerasanSeks from "../assets/cegahkekerasanseks.png";
import KekerasanSeks2 from "../assets/cegahkekerasanseks2.png";

function BeresikoSedang() {
  return (
    <div style={{ userSelect: 'none' }}>
        <img src={Reproduksi} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={KekerasanSeks} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
        <img src={KekerasanSeks2} onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }} />
    </div>
  )
}

export default BeresikoSedang