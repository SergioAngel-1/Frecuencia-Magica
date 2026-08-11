import { describe, expect, it } from 'vitest';

import { AUDIOS, COURSES, EXPERIENCES, getProduct, PRODUCTS, QUESTIONS } from '@/data';

describe('catálogo de contenido', () => {
  it('hay siete frecuencias', () => {
    expect(AUDIOS).toHaveLength(7);
  });

  it('las frecuencias conservan los Hz del prototipo', () => {
    expect(AUDIOS.map((a) => a.hz)).toEqual([432, 528, 396, 174, 639, 417, 528]);
  });

  it('hay tres cursos, cuatro experiencias, ocho productos y cinco preguntas', () => {
    expect(COURSES).toHaveLength(3);
    expect(EXPERIENCES).toHaveLength(4);
    expect(PRODUCTS).toHaveLength(8);
    expect(QUESTIONS).toHaveLength(5);
  });

  it('todos los ids son únicos', () => {
    for (const coleccion of [AUDIOS, COURSES, EXPERIENCES, PRODUCTS, QUESTIONS]) {
      const ids = coleccion.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('cada pregunta ofrece cuatro opciones', () => {
    for (const pregunta of QUESTIONS) {
      expect(pregunta.optionKeys).toHaveLength(4);
    }
  });

  it('los precios de producto son los del prototipo', () => {
    expect(PRODUCTS.map((p) => p.price)).toEqual([28, 34, 22, 26, 18, 24, 20, 30]);
  });

  it('los precios de experiencia son los del prototipo', () => {
    expect(EXPERIENCES.map((e) => e.price)).toEqual([45, 60, 55, 35]);
  });

  it('toda banda es un gradiente lineal', () => {
    for (const coleccion of [AUDIOS, COURSES, EXPERIENCES, PRODUCTS]) {
      for (const item of coleccion) {
        expect(item.band.startsWith('linear-gradient(150deg,')).toBe(true);
      }
    }
  });

  it('getProduct devuelve la entidad por id', () => {
    expect(getProduct('p1')?.price).toBe(28);
    expect(getProduct('inexistente')).toBeUndefined();
  });

  it('cada audio tiene una etiqueta estable e independiente del idioma', () => {
    expect(AUDIOS.map((a) => a.tagId)).toEqual([
      'meditation',
      'frequency',
      'grounding',
      'rest',
      'ritual',
      'breath',
      'meditation',
    ]);
  });

  it('cada producto apunta a una frecuencia existente', () => {
    const audioIds = new Set(AUDIOS.map((a) => a.id));

    for (const producto of PRODUCTS) {
      expect(audioIds.has(producto.relatedAudioId)).toBe(true);
    }
  });

  it('cada experiencia declara su modalidad', () => {
    expect(EXPERIENCES.map((e) => e.mode)).toEqual(['online', 'inPerson', 'inPerson', 'online']);
  });
});
