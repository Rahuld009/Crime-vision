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


  resetMap(): void {

  this.stopCurrentAnimation();

  if (this.marker) {
    this.map.removeLayer(this.marker);
  }

  if (this.routeLine) {
    this.map.removeLayer(this.routeLine);
  }

  this.map.setView([20.5937, 78.9629], 5);
}
}