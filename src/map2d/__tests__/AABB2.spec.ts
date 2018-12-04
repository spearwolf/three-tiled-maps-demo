import { AABB2 } from '../AABB2';

describe('AABB2', () => {
  describe('create', () => {
    const aabb = new AABB2(-5, -8, 10, 16);

    it('top', () => expect(aabb.top).toEqual(-8));
    it('left', () => expect(aabb.left).toEqual(-5));
    it('width', () => expect(aabb.width).toEqual(10));
    it('height', () => expect(aabb.height).toEqual(16));
    it('right', () => expect(aabb.right).toEqual(5));
    it('bottom', () => expect(aabb.bottom).toEqual(8));
    it('centerX', () => expect(aabb.centerX).toEqual(0));
    it('centerY', () => expect(aabb.centerY).toEqual(0));
  });

  describe('quadrant helpers', () => {
    const A = new AABB2(-20, -20, 10, 10);
    const B = new AABB2(-5, -20, 10, 10);
    const C = new AABB2(10, -20, 10, 10);
    const D = new AABB2(-20, -5, 10, 10);
    const E = new AABB2(-10, -10, 10, 10);
    const F = new AABB2(-5, -5, 10, 10);
    const G = new AABB2(0, -10, 10, 10);
    const H = new AABB2(10, -5, 10, 10);
    const I = new AABB2(-10, 0, 10, 10);
    const J = new AABB2(0, 0, 10, 10);
    const K = new AABB2(-20, 10, 10, 10);
    const L = new AABB2(-5, 10, 10, 10);
    const M = new AABB2(10, 10, 10, 10);

    it('isNorthWest(A)', () => expect(A.isNorthWest(0, 0)).toBeTruthy());
    it('isNorthEast(A)', () => expect(A.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(A)', () => expect(A.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(A)', () => expect(A.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(B)', () => expect(B.isNorthWest(0, 0)).toBeTruthy());
    it('isNorthEast(B)', () => expect(B.isNorthEast(0, 0)).toBeTruthy());
    it('isSouthEast(B)', () => expect(B.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(B)', () => expect(B.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(C)', () => expect(C.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(C)', () => expect(C.isNorthEast(0, 0)).toBeTruthy());
    it('isSouthEast(C)', () => expect(C.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(C)', () => expect(C.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(D)', () => expect(D.isNorthWest(0, 0)).toBeTruthy());
    it('isNorthEast(D)', () => expect(D.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(D)', () => expect(D.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(D)', () => expect(D.isSouthWest(0, 0)).toBeTruthy());

    it('isNorthWest(E)', () => expect(E.isNorthWest(0, 0)).toBeTruthy());
    it('isNorthEast(E)', () => expect(E.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(E)', () => expect(E.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(E)', () => expect(E.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(F)', () => expect(F.isNorthWest(0, 0)).toBeTruthy());
    it('isNorthEast(F)', () => expect(F.isNorthEast(0, 0)).toBeTruthy());
    it('isSouthEast(F)', () => expect(F.isSouthEast(0, 0)).toBeTruthy());
    it('isSouthWest(F)', () => expect(F.isSouthWest(0, 0)).toBeTruthy());

    it('isNorthWest(G)', () => expect(G.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(G)', () => expect(G.isNorthEast(0, 0)).toBeTruthy());
    it('isSouthEast(G)', () => expect(G.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(G)', () => expect(G.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(H)', () => expect(H.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(H)', () => expect(H.isNorthEast(0, 0)).toBeTruthy());
    it('isSouthEast(H)', () => expect(H.isSouthEast(0, 0)).toBeTruthy());
    it('isSouthWest(H)', () => expect(H.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(I)', () => expect(I.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(I)', () => expect(I.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(I)', () => expect(I.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(I)', () => expect(I.isSouthWest(0, 0)).toBeTruthy());

    it('isNorthWest(J)', () => expect(J.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(J)', () => expect(J.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(J)', () => expect(J.isSouthEast(0, 0)).toBeTruthy());
    it('isSouthWest(J)', () => expect(J.isSouthWest(0, 0)).toBeFalsy());

    it('isNorthWest(K)', () => expect(K.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(K)', () => expect(K.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(K)', () => expect(K.isSouthEast(0, 0)).toBeFalsy());
    it('isSouthWest(K)', () => expect(K.isSouthWest(0, 0)).toBeTruthy());

    it('isNorthWest(L)', () => expect(L.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(L)', () => expect(L.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(L)', () => expect(L.isSouthEast(0, 0)).toBeTruthy());
    it('isSouthWest(L)', () => expect(L.isSouthWest(0, 0)).toBeTruthy());

    it('isNorthWest(M)', () => expect(M.isNorthWest(0, 0)).toBeFalsy());
    it('isNorthEast(M)', () => expect(M.isNorthEast(0, 0)).toBeFalsy());
    it('isSouthEast(M)', () => expect(M.isSouthEast(0, 0)).toBeTruthy());
    it('isSouthWest(M)', () => expect(M.isSouthWest(0, 0)).toBeFalsy());
  });

  describe('isIntersection()', () => {
    const aabb = new AABB2(-10, -10, 20, 20);

    it('a', () => expect(aabb.isIntersecting(new AABB2(-20, -20, 10, 10))).toBeFalsy());
    it('b', () => expect(aabb.isIntersecting(new AABB2(-5, -20, 10, 10))).toBeFalsy());
    it('c', () => expect(aabb.isIntersecting(new AABB2(10, -20, 10, 10))).toBeFalsy());
    it('d', () => expect(aabb.isIntersecting(new AABB2(-15, -15, 10, 10))).toBeTruthy());
    it('e', () => expect(aabb.isIntersecting(new AABB2(-5, -15, 10, 10))).toBeTruthy());
    it('f', () => expect(aabb.isIntersecting(new AABB2(5, -15, 10, 10))).toBeTruthy());
    it('g', () => expect(aabb.isIntersecting(new AABB2(-20, -5, 10, 10))).toBeFalsy());
    it('h', () => expect(aabb.isIntersecting(new AABB2(-15, -5, 10, 10))).toBeTruthy());
    it('i', () => expect(aabb.isIntersecting(new AABB2(-5, -5, 10, 10))).toBeTruthy());
    it('j', () => expect(aabb.isIntersecting(new AABB2(5, -5, 10, 10))).toBeTruthy());
    it('K', () => expect(aabb.isIntersecting(new AABB2(10, -5, 10, 10))).toBeFalsy());
    it('l', () => expect(aabb.isIntersecting(new AABB2(-100, -2, 200, 4))).toBeTruthy());
    it('m', () => expect(aabb.isIntersecting(new AABB2(-2, -100, 4, 200))).toBeTruthy());
    it('n', () => expect(aabb.isIntersecting(new AABB2(-50, -50, 100, 100))).toBeTruthy());
    it('o', () => expect(aabb.isIntersecting(new AABB2(-15, 5, 10, 10))).toBeTruthy());
    it('p', () => expect(aabb.isIntersecting(new AABB2(-5, 5, 10, 10))).toBeTruthy());
    it('q', () => expect(aabb.isIntersecting(new AABB2(5, 5, 10, 10))).toBeTruthy());
    it('r', () => expect(aabb.isIntersecting(new AABB2(-20, 10, 10, 10))).toBeFalsy());
    it('s', () => expect(aabb.isIntersecting(new AABB2(-5, 10, 10, 10))).toBeFalsy());
    it('t', () => expect(aabb.isIntersecting(new AABB2(10, 10, 10, 10))).toBeFalsy());
    it('u', () => expect(aabb.isIntersecting(new AABB2(-100, -2, 200, 50))).toBeTruthy());
    it('v', () => expect(aabb.isIntersecting(new AABB2(-100, -48, 200, 50))).toBeTruthy());
    it('w', () => expect(aabb.isIntersecting(new AABB2(-48, -100, 50, 200))).toBeTruthy());
    it('x', () => expect(aabb.isIntersecting(new AABB2(2, -100, 50, 200))).toBeTruthy());
  });
});
