import '@testing-library/jest-dom/vitest';

class TestIntersectionObserver {
	constructor(callback) {
		this.callback = callback;
	}

	observe(target) {
		this.callback([{ isIntersecting: true, intersectionRatio: 1, target }], this);
	}

	unobserve() {}

	disconnect() {}

	takeRecords() {
		return [];
	}
}

globalThis.IntersectionObserver = TestIntersectionObserver;