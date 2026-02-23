// import { Injectable } from '@angular/core';
// import * as L from 'leaflet';
// import { Suspect } from '../models/suspect.model';

// @Injectable({ providedIn: 'root' })
// export class MapService {

//   private map!: L.Map;
//   private markers: L.Marker[] = [];
//   private polyline!: L.Polyline;

//   initMap(container: string) {
//     this.map = L.map(container).setView([22.9734, 78.6569], 5);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(this.map);
//   }

//   clear() {
//     this.markers.forEach(m => m.remove());
//     if (this.polyline) this.polyline.remove();
//   }

//   plotSuspect(suspect: Suspect) {
//     this.clear();
//     const path: L.LatLngExpression[] = [];

//     suspect.history.forEach(loc => {
//       const marker = L.marker([loc.latitude, loc.longitude])
//         .addTo(this.map)
//         .bindPopup(`<b>${loc.city}</b><br>${loc.arrivalTime}`);
//       this.markers.push(marker);
//       path.push([loc.latitude, loc.longitude]);
//     });

//     this.polyline = L.polyline(path, { color: 'red' }).addTo(this.map);
//     this.map.fitBounds(path as L.LatLngBoundsExpression);
//   }
// }




// import { Injectable } from '@angular/core';
// import * as L from 'leaflet';
// import { Suspect } from '../models/suspect.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class MapService {

//   private map!: L.Map;
//   private marker!: L.Marker;
//   private routeLine!: L.Polyline;

//   initMap(containerId: string): void {

//     this.map = L.map(containerId).setView([20.5937, 78.9629], 5);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap'
//     }).addTo(this.map);
//   }

//   // plotSuspect(suspect: Suspect): void {

//   //   const history = suspect.history;

//   //   if (!history || history.length === 0) return;

//   //   // Remove old route if exists
//   //   if (this.routeLine) {
//   //     this.map.removeLayer(this.routeLine);
//   //   }

//   //   const latLngs = history.map(h => [h.latitude, h.longitude]) as L.LatLngExpression[];

//   //   // Draw route
//   //   this.routeLine = L.polyline(latLngs, {
//   //     color: 'red',
//   //     weight: 3
//   //   }).addTo(this.map);

//   //   this.map.fitBounds(this.routeLine.getBounds());

//   //   // Create marker if not exists
//   //   if (!this.marker) {
//   //     this.marker = L.marker(latLngs[0]).addTo(this.map);
//   //   }

//   //   this.animateRoute(latLngs);
//   // }

//   // private animateRoute(latLngs: L.LatLngExpression[]) {

//   //   let i = 0;

//   //   const moveNext = () => {
//   //     if (i >= latLngs.length - 1) return;

//   //     this.animateMovement(
//   //       latLngs[i] as [number, number],
//   //       latLngs[i + 1] as [number, number],
//   //       4000
//   //     );

//   //     i++;
//   //     setTimeout(moveNext, 4000);
//   //   };

//   //   moveNext();
//   // }

//   // private animateMovement(
//   //   start: [number, number],
//   //   end: [number, number],
//   //   duration: number
//   // ) {

//   //   const startTime = performance.now();

//   //   const animate = (currentTime: number) => {

//   //     const elapsed = currentTime - startTime;
//   //     const progress = Math.min(elapsed / duration, 1);

//   //     const lat = start[0] + (end[0] - start[0]) * progress;
//   //     const lng = start[1] + (end[1] - start[1]) * progress;

//   //     this.marker.setLatLng([lat, lng]);

//   //     if (progress < 1) {
//   //       requestAnimationFrame(animate);
//   //     }
//   //   };

//   //   requestAnimationFrame(animate);
//   // }


//   plotSuspect(suspect: Suspect): void {

//   const history = suspect.history;
//   if (!history || history.length < 2) return;

//   const latLngs = history.map(h => [h.latitude, h.longitude]) as [number, number][];

//   // Remove previous route
//   if (this.routeLine) {
//     this.map.removeLayer(this.routeLine);
//   }

//   // Create EMPTY polyline first
//   this.routeLine = L.polyline([], {
//     color: 'red',
//     weight: 4
//   }).addTo(this.map);

//   // Create marker at starting point
//   if (!this.marker) {
//     this.marker = L.marker(latLngs[0]).addTo(this.map);
//   } else {
//     this.marker.setLatLng(latLngs[0]);
//   }

//   this.map.setView(latLngs[0], 6);

//   this.animateRoute(latLngs);
// }

// private animateMovement(
//   start: [number, number],
//   end: [number, number],
//   duration: number,
//   callback: () => void
// ) {

//   const startTime = performance.now();

//   const animate = (currentTime: number) => {

//     const elapsed = currentTime - startTime;
//     const progress = Math.min(elapsed / duration, 1);

//     const lat = start[0] + (end[0] - start[0]) * progress;
//     const lng = start[1] + (end[1] - start[1]) * progress;

//     const currentPosition: [number, number] = [lat, lng];

//     // Move marker
//     this.marker.setLatLng(currentPosition);

//     // 🔥 AUTO FOLLOW FIX
//     if (!this.map.getBounds().contains(currentPosition)) {
//       this.map.panTo(currentPosition, { animate: true });
//     }

//     // Grow trail
//     this.routeLine.addLatLng(currentPosition);

//     if (progress < 1) {
//       requestAnimationFrame(animate);
//     } else {
//       callback();
//     }
//   };

//   requestAnimationFrame(animate);
// }

// private animateRoute(latLngs: [number, number][]) {

//   let i = 0;

//   const moveNext = () => {

//     if (i >= latLngs.length - 1) {

//       // ✅ When animation fully complete
//       const bounds = L.latLngBounds(latLngs);
//       this.map.fitBounds(bounds, { padding: [50, 50] });

//       return;
//     }

//     this.animateMovement(
//       latLngs[i],
//       latLngs[i + 1],
//       4000,
//       () => {
//         i++;
//         moveNext();
//       }
//     );
//   };

//   moveNext();
// }
// }


import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Suspect } from '../models/suspect.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: L.Map;
  private marker!: L.Marker;
  private routeLine!: L.Polyline;

  // 🔥 Animation control
  private animationFrameId: number | null = null;
  private isAnimating = false;

  /* =========================================
     MAP INITIALIZATION
  ========================================== */

  initMap(containerId: string): void {

    this.map = L.map(containerId).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  /* =========================================
     MAIN PLOT METHOD
  ========================================== */

  plotSuspect(suspect: Suspect): void {

    // 🔥 STOP previous tracking completely
    this.stopCurrentAnimation();

    const history = suspect.history;
    if (!history || history.length < 2) return;

    const latLngs = history.map(h => [h.latitude, h.longitude]) as [number, number][];

    // Remove previous route line if exists
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }

    // Create empty polyline
    this.routeLine = L.polyline([], {
      color: 'red',
      weight: 4
    }).addTo(this.map);

    // Create or reset marker
    if (!this.marker) {
      this.marker = L.marker(latLngs[0]).addTo(this.map);
    } else {
      this.marker.setLatLng(latLngs[0]);
    }

    this.map.setView(latLngs[0], 6);

    // Start animation
    this.animateRoute(latLngs);
  }

  /* =========================================
     STOP CURRENT ANIMATION (CRITICAL FIX)
  ========================================== */

  private stopCurrentAnimation(): void {

    this.isAnimating = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }
  }

  /* =========================================
     ROUTE ANIMATION CONTROLLER
  ========================================== */

  private animateRoute(latLngs: [number, number][]): void {

    this.isAnimating = true;

    let i = 0;

    const moveNext = () => {

      // If animation cancelled
      if (!this.isAnimating) return;

      if (i >= latLngs.length - 1) {

        // ✅ When full route complete → show entire path
        const bounds = L.latLngBounds(latLngs);
        this.map.fitBounds(bounds, { padding: [50, 50] });

        this.isAnimating = false;
        return;
      }

      this.animateMovement(
        latLngs[i],
        latLngs[i + 1],
        4000,
        () => {
          i++;
          moveNext();
        }
      );
    };

    moveNext();
  }

  /* =========================================
     SMOOTH MARKER MOVEMENT
  ========================================== */

  private animateMovement(
    start: [number, number],
    end: [number, number],
    duration: number,
    callback: () => void
  ): void {

    const startTime = performance.now();

    const animate = (currentTime: number) => {

      if (!this.isAnimating) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;

      const currentPosition: [number, number] = [lat, lng];

      // Move marker
      this.marker.setLatLng(currentPosition);

      // 🔥 Auto follow while moving
      if (!this.map.getBounds().contains(currentPosition)) {
        this.map.panTo(currentPosition, { animate: true });
      }

      // Grow polyline
      this.routeLine.addLatLng(currentPosition);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}