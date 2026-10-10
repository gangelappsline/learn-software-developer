import { describe, expect, it } from 'vitest';
import { missionSeed } from '@/data/missions';
import { languages } from '@/data/languages';

describe('seed content', () => {
  it('ships three distinct missions for each of the ten learning tracks', () => {
    expect(missionSeed).toHaveLength(30);
    expect(languages).toHaveLength(10);
    expect(new Set(missionSeed.map((mission) => mission.id)).size).toBe(30);
    for (const language of languages) {
      expect(missionSeed.filter((mission) => mission.language === language.id)).toHaveLength(3);
    }
  });
});
