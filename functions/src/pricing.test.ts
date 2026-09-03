import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAllTiers, computeBreakdown, INSURANCE_FEE } from "./pricing";

// Reference shipment: 12.5kg, uninsured — the fallback ShipScreen uses when
// weight is left blank, and the input the Figma design's headline tier
// prices (Standard/Express/Priority) were priced against.
const REFERENCE_WEIGHT_KG = 12.5;

test("reproduces the Figma numbers exactly at the reference shipment", () => {
  const tiers = computeAllTiers(REFERENCE_WEIGHT_KG, false);
  assert.equal(tiers.standard.total, 15938);
  assert.equal(tiers.express.total, 24704);
  assert.equal(tiers.priority.total, 35064);
});

test("insurance adds exactly the insurance fee to every tier, nothing else changes", () => {
  const uninsured = computeAllTiers(REFERENCE_WEIGHT_KG, false);
  const insured = computeAllTiers(REFERENCE_WEIGHT_KG, true);

  for (const tier of ["standard", "express", "priority"] as const) {
    assert.equal(insured[tier].insurance, INSURANCE_FEE);
    assert.equal(uninsured[tier].insurance, 0);
    assert.equal(insured[tier].total, uninsured[tier].total + INSURANCE_FEE);
    assert.equal(insured[tier].base, uninsured[tier].base);
    assert.equal(insured[tier].weightCharge, uninsured[tier].weightCharge);
    assert.equal(insured[tier].fuel, uninsured[tier].fuel);
  }
});

test("weight charge scales at ₦220/kg, rounded to the nearest naira", () => {
  assert.equal(computeBreakdown("express", 10, false).weightCharge, 2200);
  assert.equal(computeBreakdown("express", 1, false).weightCharge, 220);
  // 3.333 * 220 = 733.26 -> rounds to 733
  assert.equal(computeBreakdown("express", 10 / 3, false).weightCharge, 733);
});

test("fuel surcharge is a flat ₦1,066 regardless of tier or weight", () => {
  assert.equal(computeBreakdown("standard", 1, false).fuel, 1066);
  assert.equal(computeBreakdown("priority", 500, true).fuel, 1066);
});

test("each tier has a distinct base rate, ordered standard < express < priority", () => {
  const tiers = computeAllTiers(0, false);
  assert.ok(tiers.standard.base < tiers.express.base);
  assert.ok(tiers.express.base < tiers.priority.base);
});

test("total is always the sum of its own breakdown parts", () => {
  for (const tier of ["standard", "express", "priority"] as const) {
    for (const insured of [false, true]) {
      const b = computeBreakdown(tier, 27.4, insured);
      assert.equal(b.total, b.base + b.weightCharge + b.fuel + b.insurance);
    }
  }
});
