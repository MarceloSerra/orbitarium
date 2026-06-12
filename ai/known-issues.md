# Known Issues

## Edge Cases & Constraints

### Performance
- **Star count limit**: Maximum 5000 stars to maintain frame rate
- **Instanced meshes required** for particle systems (galaxies, distant stars)
- **Texture loading**: NASA URLs may fail due to CORS, network issues, or URL changes

### Interaction
- **Rapid clicks**: Need debounce on planet selection handler
- **Toggle behavior**: Clicking selected planet should close drawer
- **Camera controls**: OrbitControls may conflict with click detection

### Data
- **Scale compression**: Real distances compressed for visualization - document this clearly
- **Proportional sizes**: Jupiter >> Earth >> Mars, but not 1:1 with reality

## Technical Debt (Potential)
- None identified yet

## Bugs
- None identified yet
