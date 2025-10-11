<script lang="ts">
let { tooltipClass, svgClass, dataTip }: { tooltipClass: string; svgClass: string; dataTip: string } = $props();
</script>

<div class="tooltip inline-flex {tooltipClass} z-100" data-tip={dataTip}>
    <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" aria-label={dataTip}>
        <svg class="w-4 h-4 {svgClass}" aria-hidden="true" fill="currentColor" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"
            ><path
                fill="currentColor"
                d="M11.95 18q.525 0 .888-.363t.362-.887q0-.525-.362-.888t-.888-.362q-.525 0-.887.363t-.363.887q0 .525.363.888t.887.362m.05 4q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m.1-14.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2" /></svg>
    </button>
</div>
