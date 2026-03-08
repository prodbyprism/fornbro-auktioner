-- Seed initial categories for Fornbro Auktioner

INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Möbler', 'mobler', 'Antika möbler, stolar, bord och skåp', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'),
  ('Konst', 'konst', 'Målningar, skulpturer och grafik', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'),
  ('Silver & Smycken', 'silver-smycken', 'Antikt silver, smycken och klockor', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'),
  ('Glas & Porslin', 'glas-porslin', 'Svenskt och europeiskt konstglas och porslin', 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=800'),
  ('Belysning', 'belysning', 'Antika lampor, ljuskronor och ljusstakar', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'),
  ('Mattor & Textilier', 'mattor-textilier', 'Orientaliska mattor och antika textilier', 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800')
ON CONFLICT (slug) DO NOTHING;
