import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../services/album';
import { Album } from '../../models/album.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.css',
})
export class AlbumDetail implements OnInit {
  albumId!: number;
  album?: Album;

  editedTitle = '';

  loading = true;
  saving = false;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService
  ) {}

  ngOnInit(): void {
    this.albumId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAlbum();
  }

  loadAlbum() {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.albumService.getAlbum(this.albumId).subscribe({
      next: (data) => {
        this.album = data;
        this.editedTitle = data.title;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load album details';
        this.loading = false;
      }
    });
  }

  save() {
    if (!this.album) return;

    this.saving = true;
    this.error = '';
    this.success = '';

    const updated: Album = { ...this.album, title: this.editedTitle };

    this.albumService.updateAlbum(updated).subscribe({
      next: (res) => {
        this.album = res;
        this.success = 'Saved (simulated).';
        this.saving = false;
      },
      error: () => {
        this.error = 'Save failed';
        this.saving = false;
      }
    });
  }

  back() {
    this.router.navigate(['/albums']);
  }

  goToPhotos() {
    this.router.navigate(['/albums', this.albumId, 'photos']);
  }
}
