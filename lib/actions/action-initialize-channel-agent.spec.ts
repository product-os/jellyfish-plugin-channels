import { hasSettings } from './action-initialize-channel-agent';
import { v4 as uuid } from 'uuid';

describe('hasSettings()', () => {
	test('should return true on match', () => {
		const result = hasSettings(
			[
				{
					type: 'user@1.0.0',
					links: {
						'has settings': [
							{
								type: 'working-hours@1.0.0',
								id: uuid(),
								slug: `working-hours-${uuid()}`,
								version: '1.0.0',
								active: true,
								data: {},
								tags: [],
								markers: [],
								requires: [],
								capabilities: [],
								created_at: new Date().toISOString(),
							},
						],
					},
				},
			],
			{
				type: 'working-hours@1.0.0',
			},
		);
		expect(result).toBe(true);
	});

	test('should return false on mismatching predicate', () => {
		const result = hasSettings(
			[
				{
					type: 'user@1.0.0',
					links: {
						'has settings': [
							{
								type: 'working-hours@1.0.0',
								id: uuid(),
								slug: `working-hours-${uuid()}`,
								version: '1.0.0',
								active: true,
								data: {},
								tags: [],
								markers: [],
								requires: [],
								capabilities: [],
								created_at: new Date().toISOString(),
							},
						],
					},
				},
			],
			{
				type: 'agent-settings@1.0.0',
			},
		);
		expect(result).toBe(false);
	});

	test('should return false on no links', () => {
		const result = hasSettings(
			[
				{
					type: 'user@1.0.0',
					links: {},
				},
			],
			{
				type: 'agent-settings@1.0.0',
			},
		);
		expect(result).toBe(false);
	});

	test('should return false on no contracts', () => {
		const result = hasSettings([], {
			type: 'agent-settings@1.0.0',
		});
		expect(result).toBe(false);
	});
});
